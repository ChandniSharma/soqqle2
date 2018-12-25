import React, {Component} from 'react';
import {Button, Image, Keyboard, Platform, StatusBar, StyleSheet, TextInput, View} from 'react-native';
import {GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk';
import LinkedInModal from 'react-native-linkedin';
import Icon from 'react-native-vector-icons/FontAwesome';
import {showMessage} from 'react-native-flash-message';
import {MAIN_COLOR} from "../constants";
import {LINKEDIN_LOGIN_APP_ID, LINKEDIN_LOGIN_APP_SECRET, LINKEDIN_LOGIN_CALLBACK} from "../config";
const baseApi = 'https://api.linkedin.com/v1/people/'
var RCTNetworking = require('RCTNetworking')

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

export default class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {email: '', password: ''};
  }

  static flashMessage = message => {
    showMessage({message, type: MAIN_COLOR});
  }

  linkedinLogin = async token => {
    try {
      const {userActions} = this.props;
      const params = ['id'];
      const response = await fetch(
        `${baseApi}~:(${params.join(',')})?format=json`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      )
      const result = await response.json();
      userActions.linkedinLoginRequest(result.id);
    } catch (error) {
      LoginView.flashMessage('Can not fetch your LinkedIn profile')
    }
  }

  facebookLogin = () => {
    const {userActions} = this.props;
    const getFacebookInfoCallback = (error, result) => {
      if (error) {
        LoginView.flashMessage('Can not fetch your Facebook profile')
      } else {
        userActions.facebookLoginRequest(result.id);
        console.log('Success fetching data: ', result);
      }
    };
    LoginManager.logInWithReadPermissions(['public_profile']).then(function (result) {
        if (result.isCancelled) {
          LoginView.flashMessage('Facebook login has been canceled')
        } else {
          const infoRequest = new GraphRequest(
            '/me',
            null,
            getFacebookInfoCallback,
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      }, function (error) {
        LoginView.flashMessage('Unexpected error, please try again!')
      }
    );
  };

  login = () => {
    Keyboard.dismiss();
    const { userActions } = this.props;
    const {email, name, password} = this.state;
    if (!email || !name || !password) {
      return LoginView.flashMessage('Please enter your name, email and password');
    }
    userActions.loginRequest(this.state);
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
  }

  goToStory = () => {
    this.props.navigation.navigate({ routeName: 'Story' })
  }

  gotToAgenda = () => {
    this.props.navigation.navigate({ routeName: 'Agenda' })
  }

  render() {
    const {email, password, name} = this.state;
    return (
      <View
        style={styles.container}
      >
        <Image style={styles.logo} source={require('../images/logo.png')}/>
        <View>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#ffffff"
            value={name}
            onChangeText={name => this.setState({name})}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#ffffff"
            value={email}
            onChangeText={email => this.setState({email})}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ffffff"
            secu       reTextEntry
            value={password}
            onChangeText={password => this.setState({password})}
            style={styles.textInput}
          />
          <View style={styles.margin10}>
          <Button title="GO TO STORY" onPress={() => this.goToStory()} />
          </View>
          <View style={styles.margin10}>
          <Button title="GO TO AGENDA" onPress={() => this.gotToAgenda()} />
          </View>
          <View style={styles.margin10}>
          <Button
            style={styles.button}
            onPress={this.login}
            title="Login"
            color={MAIN_COLOR}
            accessibilityLabel="Learn more about this purple button"
          />
          </View>
          <View style={styles.socialLogin}>
            <Icon.Button name="facebook" style={styles.button} backgroundColor="#3b5998" onPress={this.facebookLogin}>
              Login with Facebook
            </Icon.Button>
              <LinkedInModal
                ref={ref => { this.modal = ref; }}
                renderButton={() => <Icon.Button onPress={() => {
                  RCTNetworking.clearCookies((cleared) => {
                    this.modal.open()
                  })
                }} name="linkedin" style={styles.button} backgroundColor="#1178B3">
                  Login with LinkedIn
                </Icon.Button>}
                clientID={LINKEDIN_LOGIN_APP_ID}
                clientSecret={LINKEDIN_LOGIN_APP_SECRET}
                onError={error => {
                  LoginView.flashMessage('LinkedIn Login is cancelled');
                }}
                redirectUri={LINKEDIN_LOGIN_CALLBACK}
                onSuccess={token => {
                  this.linkedinLogin(token.access_token)
                }}
              />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: statusBarHeight + 5,
    justifyContent: 'center',
    backgroundColor: '#08091a',
    flex: 1
  },
  logo: {
    alignSelf: 'center',
    width: 150,
    height: 150,
  },
  socialLogin: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  margin10: {
    marginTop: 20,
  },
  button: {
    width: '90%'
  },
  textInput: {
    borderRadius: 4,
    marginTop: 10,
    height: 40,
    padding: 5,
    borderColor: 'gray',
    borderWidth: 1,
    color: MAIN_COLOR
  }
});
