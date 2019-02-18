import React, {Component} from 'react';
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    TouchableOpacity,
    View
} from 'react-native';
import {GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk';
import {Button, Input, Item, Label, Text, Thumbnail} from 'native-base';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinkedInModal from 'react-native-linkedin';

import {isValidEmail} from '../utils/common';
import * as constants from '../constants';
import {MAIN_COLOR} from '../constants';
import Step1 from './login/Step1';
import Step3 from './login/Step3';
import Step2 from './login/Step2';
import {LINKEDIN_LOGIN_APP_ID, LINKEDIN_LOGIN_APP_SECRET, LINKEDIN_LOGIN_CALLBACK} from '../config';
import styles from '../stylesheets/loginView.iosStyles';
import MixPanel from "react-native-mixpanel";

const baseApi = 'https://api.linkedin.com/v1/people/';
const RCTNetworking = require('RCTNetworking');
const faceBookProfileFields = ['id', 'email', 'friends', 'picture.type(large)', 'first_name', 'last_name'];
const linkedInProfileFields = ['id', 'first-name', 'last-name', 'email-address', 'picture-urls::(original)',
    'picture-url::(original)', 'headline', 'specialties', 'industry'];

// TODO: Update this class to new Lifecycle methods
export default class LoginView extends Component {

    static flashMessage = message => showMessage({message, type: MAIN_COLOR});

    linkedinLogin = async token => {
        try {
            const {userActions} = this.props;
            const response = await fetch(
                `${baseApi}~:(${linkedInProfileFields.join(',')})?format=json`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            const result = await response.json();
            userActions.linkedinLoginRequest({...result, accessToken: token});
        } catch (error) {
            LoginView.flashMessage('Can not fetch your LinkedIn profile');
        }
    };

    facebookLogin = async () => {
        const {userActions} = this.props;
        const getFacebookInfoCallback = (error, result) => {
            if (error) {
                console.log('=======', error);
                LoginView.flashMessage('Can not fetch your Facebook profile');
            } else {
                userActions.facebookLoginRequest(result);
                console.log('Success fetching data: ', JSON.stringify(result));
            }
        };

        const processResult = result => {
            try {
                if (result.isCancelled) {
                    LoginView.flashMessage('Facebook login has been canceled');
                } else {
                    const infoRequest = new GraphRequest(
                        `me?fields=${faceBookProfileFields.join(',')}`,
                        null,
                        getFacebookInfoCallback,
                    );
                    console.log('=======');
                    return new GraphRequestManager().addRequest(infoRequest).start();
                }
            } catch (error) {
                console.log('====error====', error);
                LoginView.flashMessage('Unexpected error, please try again!');
            }
        };
        let result = {};
        try {
            this.setState({showLoadingModal: true});
            result = await LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']);
            processResult(result);
        } catch (nativeError) {
            try {
                LoginManager.setLoginBehavior('web');
                result = await LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']);
                processResult(result);
            } catch (webError) {
                console.log('web===error====', webError);
                LoginView.flashMessage('Can not login with your Facebook, please try again!');
            }
        }
    };

    login = () => {
        Keyboard.dismiss();
        const {userActions} = this.props;
        const {email, password} = this.state;
        if (!password) {
            return LoginView.flashMessage('Please enter your password');
        }
		    MixPanel.track('Sign in');
        userActions.loginRequest({email, password, name: 'hardcoded'}); //API required name in login case??
    };

    signup = () => {
        Keyboard.dismiss();
        const {userActions} = this.props;
        const {email, name, password, isAgree, repassword} = this.state;
        if (!name || !password || !repassword) {
            return LoginView.flashMessage('Please enter your name, password and re-password');
        }
        if (password !== repassword) {
            return LoginView.flashMessage('Password and re-password are not matched');
        }
        if (!isAgree) {
            return LoginView.flashMessage('Please agree to the Privacy Policy and Terms and Conditions.');
        }
        MixPanel.track('Sign up - ios')
        userActions.loginRequest({email, password, name});
    };

    showforgotPasswordView = () => {
        this.setState({
            modalVisible: true,
            newPassword: ''
        });
    };

    onOtherEmail = () => {
        this.setState({step: 1, email: ''});
    };

    onChange = (field, value) => {
        this.setState({[field]: value});
    };

    onEmailSubmit = () => {
        const {email} = this.state;
        const {userActions} = this.props;
        if (!isValidEmail(email)) {
            return LoginView.flashMessage('Please enter an valid email');
        }
        userActions.checkEmailRequest(email.toLowerCase());
    };

    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            email: '',
            password: '',
            newPassword: '',
            isAgree: false,
            modalVisible: false,
            processing: false,
        };
    }

    forgotPassword() {
        Keyboard.dismiss();
        const {userActions} = this.props;
        const {email, newPassword} = this.state;
        if (!email) {
            return LoginView.flashMessage(constants.KEMAIL_VALIDATION_ALERT);
        } else if (!isValidEmail(email)) {
            return LoginView.flashMessage(constants.KEMAIL_VALIDATION_ALERT);
        } else if (!newPassword) {
            return LoginView.flashMessage(constants.KPASSWORD_VALIDATION_ALERT);
        } else {
            userActions.forgotpasswordRequested(this.state);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error && nextProps.error.message) {
            LoginView.flashMessage(nextProps.error.message);
        }
        if (nextProps.registerSuccess && nextProps.registerSuccess !== this.props.registerSuccess) {
            LoginView.flashMessage('Register successful');
            this.props.navigate({routeName: 'LoginScreen'});
        }
        if (nextProps.loginSuccess && nextProps.loginSuccess !== this.props.loginSuccess) {
            LoginView.flashMessage('Login successful');
            this.props.navigation.navigate({routeName: 'Story'});
        }
        if (nextProps.checkEmailResult && nextProps.checkEmailResult !== this.props.checkEmailResult) {
            if (nextProps.checkEmailResult.isExisten) {
                this.setState({email: nextProps.checkEmailResult.email, step: 2});
            } else {
                this.setState({email: nextProps.checkEmailResult.email, step: 3});
            }
        }

        if (nextProps.forgotpasswordSuccess && nextProps.forgotpasswordSuccess !== this.props.forgotpasswordSuccess) {
            LoginView.flashMessage(constants.KFORGOT_PWD_SUCCESS_ALERT);
            this.setState({modalVisible: false,});
        } else {
            this.setState({modalVisible: false,});
        }

    }

    clearCookiesFacebookLogin() {
        RCTNetworking.clearCookies(() => this.facebookLogin());
    }

    clearCookiesOpenModal() {
        RCTNetworking.clearCookies(() => this.modal.open());
    }

    toggleModalVisibility() {
        const {modalVisible} = this.state;
        this.setState({modalVisible: !modalVisible});
    }

    modalOnPasswordChange(newPassword) {
        this.setState({newPassword});
    }

    render() {
        const {email, password, name, isAgree, modalVisible, step, repassword} = this.state;
        return (
            <KeyboardAvoidingView behavior="padding"
                style={styles.container}
            >
                <Image style={styles.logo} source={require('../images/image2.1.png')} resizeMode="contain"/>
                <View style={styles.content}>
                    {step === 1 && <Step1 onChange={this.onChange} email={email} onEmailSubmit={this.onEmailSubmit}/>}
                    {step === 2 && <Step2 onChange={this.onChange} password={password} onLogin={this.login}
                        showforgotPasswordView={this.showforgotPasswordView}
                        onOtherEmail={this.onOtherEmail}/>}
                    {step === 3 &&
                    <Step3 onChange={this.onChange} password={password} repassword={repassword} name={name}
                        isAgree={isAgree}
                        onSignup={this.signup}/>}
                    {step === 1 && <View style={styles.socialLogin}>
                        <Text style={[styles.text]}>Or</Text>
                    </View>}
                    {step === 1 && <View style={styles.socialLogin}>
                        <TouchableOpacity style={{marginRight: 5}} onPress={this.clearCookiesFacebookLogin.bind(this)}>
                            <Thumbnail square large source={require('../images/facebook.png')}/>
                        </TouchableOpacity>
                        <LinkedInModal
                            ref={ref => {
                                this.modal = ref;
                            }}
                            renderButton={() => <TouchableOpacity style={{marginLeft: 5}}
                                                                  onPress={this.clearCookiesOpenModal.bind(this)}>
                                <Thumbnail square large source={require('../images/in.png')}/>
                            </TouchableOpacity>}
                            clientID={LINKEDIN_LOGIN_APP_ID}
                            clientSecret={LINKEDIN_LOGIN_APP_SECRET}
                            onError={() => LoginView.flashMessage('LinkedIn Login is cancelled')}
                            redirectUri={LINKEDIN_LOGIN_CALLBACK}
                            onSuccess={token => this.linkedinLogin(token.access_token)}
                        />
                    </View>}
                </View>
                <Modal
                    animationType="fade"
                    transparent
                    visible={modalVisible}
                    onRequestClose={this.toggleModalVisibility.bind(this)}
                >
                    <View style={styles.helpModal}>
                        <View style={styles.helpModalContent}>
                            <Item floatingLabel>
                                <Label style={styles.inputLabel}>New Password</Label>
                                <Input
                                    style={styles.textInputPwd}
                                    secureTextEntry
                                    value={this.state.newPassword}
                                    onChangeText={this.modalOnPasswordChange.bind(this)}
                                />
                            </Item>
                            <Button
                                style={styles.stepButton}
                                onPress={() => this.forgotPassword()}>
                                <Text style={styles.likeModalAction}>Forgot Password</Text>
                            </Button>
                            <TouchableOpacity
                                onPress={this.toggleModalVisibility.bind(this)}
                                style={styles.likeModalClose}
                            >
                                <View>
                                    <Icon name='close' style={styles.likeModalCloseIcon}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        );
    }
}
