/** @format */
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {AppRegistry} from 'react-native';

import AppContainer from './src/containers/AppContainer';
import store from './src/redux/store';
import {name} from './app.json';

class SoqqleApp extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppContainer/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent(name, () => SoqqleApp);
