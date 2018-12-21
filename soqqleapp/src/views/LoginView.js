import React, {Component} from 'react';
import {Button, Image, Platform, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {AccessToken, LoginButton} from 'react-native-fbsdk';


const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingTop: statusBarHeight + 5,
    backgroundColor: '#08091a',
    flex: 1
  },
});

export default class LoginView extends Component {

  render() {
    console.log(this.props);
    return (
      <View
        style={styles.container}
      >
        <Text>Hello world!</Text>
        <View>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          />
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          />
          <Button
            onPress={() => {}}
            title="Login"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
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
            onLogoutFinished={() => console.log("logout.")}/>
        </View>
      </View>
    );
  }
}
