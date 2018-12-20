import AppContainer from './src/containers/AppContainer';

import React, {Component} from 'react';
import {AppRegistry} from 'react-native';

class SoqqleApp extends Component {
  render() {
    return (
        <AppContainer />
    );
  }
}

AppRegistry.registerComponent('soqqle_app', () => SoqqleApp);
