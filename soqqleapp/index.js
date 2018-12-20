/** @format */
import AppContainer from './src/containers/AppContainer';
import { name as appName } from './app.json';
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

class SoqqleApp extends Component {
    render() {
        return (
            <AppContainer />
        );
    }
}

AppRegistry.registerComponent(appName, () => SoqqleApp);
