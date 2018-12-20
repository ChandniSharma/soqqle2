import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, StatusBar, TextInput, Button, Image } from 'react-native';


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
        return (
            <View
                style={styles.container}
            >
                <Text>Hello world!</Text>
                <View>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    />
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    />
                    <Button
                        title="Login"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                </View>
            </View>
        );
    }
}