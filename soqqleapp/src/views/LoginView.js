import React, { Component } from 'react';
import { Button, Image, Keyboard, Platform, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { AccessToken, LoginButton } from 'react-native-fbsdk';
import { showMessage } from 'react-native-flash-message';
import { MAIN_COLOR } from "../constants";
const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

export default class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = { email: '', password: '' }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && nextProps.error.message) {
      showMessage({
        message: nextProps.error.message,
        type: '#750830'
      });
    }
    if (nextProps.registerSuccess && nextProps.registerSuccess !== this.props.registerSuccess) {
      showMessage({
        message: 'Register successful',
        backgroundColor: '#750830',
        type: '#750830'
      });
      this.props.navigate({ routeName: 'LoginScreen' });
    }
    if (nextProps.loginSuccess && nextProps.loginSuccess !== this.props.loginSuccess) {
      showMessage({
        message: 'Login successful',
        backgroundColor: '#750830',
        type: '#750830'
      });
      this.props.navigation.navigate({ routeName: 'Story' });
    }
  }

  goToStory = () => {
    this.props.navigation.navigate({ routeName: 'Story' })
  }

  login = () => {
    Keyboard.dismiss();
    const { userActions } = this.props;
    userActions.loginRequest(this.state);
  }

  gotToAgenda = () => {
    this.props.navigation.navigate({ routeName: 'Agenda' })
  }

  render() {
    const { email, password, name } = this.state;
    return (
      <View
        style={styles.container}
      >
        <Text>Hello world!</Text>
        <View>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#ffffff"
            value={name}
            onChangeText={name => this.setState({ name })}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#ffffff"
            value={email}
            onChangeText={email => this.setState({ email })}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ffffff"
            secureTextEntry
            value={password}
            onChangeText={password => this.setState({ password })}
            style={styles.textInput}
          />
          <Button
            onPress={this.login}
            title="Login"
            color={MAIN_COLOR}
            accessibilityLabel="Learn more about this purple button"
          />
          <Button title="GO TO STORY" onPress={() => this.goToStory()} />
          <Button title="GO TO AGENDA" onPress={() => this.gotToAgenda()} />
          <LoginButton
            onLoginFinished={
              (error, result) => {
                if (error) {
                  console.log("login has error: " + JSON.stringify(error));
                } else if (result.isCancelled) {
                  console.log("login is cancelled.");
                } else {
                  console.log(result);
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      console.log(data.accessToken.toString());
                    }
                  );
                }
              }
            }
            onLogoutFinished={() => console.log("logout.")} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingTop: statusBarHeight + 5,
    justifyContent: 'center',
    backgroundColor: '#08091a',
    flex: 1
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
