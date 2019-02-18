/** @format */
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {AppRegistry} from 'react-native';

import AppContainer from './src/containers/AppContainer';
import store from './src/redux/store';
import {name} from './app.json';
import MixPanel from 'react-native-mixpanel';

console.disableYellowBox = true;

class SoqqleApp extends Component {
  componentDidMount(): void {
    MixPanel.sharedInstanceWithToken('e7c650f3109a0c654a4409c5f6afb9c3');
  }

  render() {
        return (
            <Provider store={store}>
                <AppContainer/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent(name, () => SoqqleApp);
