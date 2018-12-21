import React  from 'react';
import { createStackNavigator } from 'react-navigation';
import LoginContainer from '../containers/LoginContainer'
import StoryContainer from '../containers/StoryContainer'


const AppNavigator = createStackNavigator({
    Login: { screen: LoginContainer },
    Story: { screen: StoryContainer }
  },
  {
    // initialRouteName: 'Story',
    headerMode: 'none'
  }
);

export default AppNavigator;
