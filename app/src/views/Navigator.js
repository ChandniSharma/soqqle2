import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation';
import LoginContainer from '../containers/LoginContainer'


const AppNavigator = createStackNavigator({
  Login: {screen: LoginContainer},
});

export default AppNavigator;
