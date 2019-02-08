import React, {Component} from 'react';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import {Button, Form, Input, Item, Text} from 'native-base';

import styles from '../../stylesheets/login/step2Styles';

export default class Step2 extends Component {
    render() {
        const {password, onChange, onLogin, showforgotPasswordView, onOtherEmail} = this.props;
        return (
            <Form>
                <Item rounded style={styles.textInput}>
                    <Input
                        style={styles.textInput}
                        secureTextEntry
                        value={password}
                        placeholder='Password'
                        onChangeText={value => onChange('password', value)}
                    />
                </Item>
                <Button transparent style={styles.btnForgotPwd} onPress={onOtherEmail}>
                    <Text style={styles.textForgotpassword}>Login with other email</Text>
                </Button>
                <Button transparent style={styles.btnForgotPwd} onPress={showforgotPasswordView}>
                    <Text style={styles.textForgotpassword}>Forgot password?</Text>
                </Button>
                <View style={styles.margin10}>
                    <ImageBackground style={{width: '100%', height: 57}} source={require('../../images/Rectangle.png')}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={onLogin}
                        >
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </Form>
        );
    }
}

