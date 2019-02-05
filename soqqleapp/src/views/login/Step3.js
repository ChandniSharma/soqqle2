import React, {Component} from 'react';
import {ImageBackground, Linking, TouchableOpacity, View} from 'react-native';
import {CheckBox, Form, Input, Item, Text} from 'native-base';

import LoginView from '../LoginView';
import styles from '../../stylesheets/login/step3Styles'

const PRIVACY_LINK = 'https://beta.soqqle.com/privacyPolicy';
const TERM_OF_USE_LINK = 'https://beta.soqqle.com/termsOfUse';

export default class Step3 extends Component {
    openLink = url => {
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                LoginView.flashMessage('Can not open web browser');
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => LoginView.flashMessage('Can not open web browser'));
    };

    render() {
        const {password, repassword, name, onChange, onSignup, isAgree} = this.props;
        return (
            <Form>
                <Item rounded style={[styles.textInput, styles.inputWrapper]}>
                    <Input
                        style={styles.textInput}
                        value={name}
                        placeholder={'Enter your name'}
                        onChangeText={value => onChange('name', value)}
                    />
                </Item>
                <Item rounded style={[styles.textInput, styles.inputWrapper]}>
                    <Input
                        style={styles.textInput}
                        secureTextEntry
                        value={password}
                        placeholder="Password"
                        onChangeText={value => onChange('password', value)}
                    />
                </Item>
                <Item rounded style={[styles.textInput, styles.inputWrapper]}>
                    <Input
                        style={styles.textInput}
                        secureTextEntry
                        value={repassword}
                        placeholder="Re-password"
                        onChangeText={value => onChange('repassword', value)}
                    />
                </Item>
                <View style={{height: 40, marginTop: 10, flexDirection: 'row'}}>
                    <CheckBox style={styles.checkbox} checked={isAgree} onPress={() => onChange('isAgree', !isAgree)}/>
                    <View style={{marginLeft: 20, flexDirection: 'row', flexWrap: 'wrap'}}><Text style={styles.text}>I
                        agree to
                        the </Text><TouchableOpacity onPress={() => this.openLink(PRIVACY_LINK)}><Text
                        style={styles.inputLabel}>Privacy
                        Policy</Text></TouchableOpacity><Text style={styles.text}> and </Text><TouchableOpacity
                        onPress={() => this.openLink(TERM_OF_USE_LINK)}><Text style={styles.inputLabel}>Terms and
                        Conditions.</Text></TouchableOpacity></View>
                </View>
                <View style={styles.margin10}>
                    <ImageBackground style={{width: '100%', height: 50}} source={require('../../images/Rectangle.png')}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={onSignup}
                        >
                            <Text style={styles.loginText}>Sign up</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </Form>
        );
    }
}

