import React from 'react';
import { createStackNavigator } from 'react-navigation';
import LoginContainer from '../containers/LoginContainer'
import StoryContainer from '../containers/StoryContainer'
import AgendaContainer from '../containers/AgendaContainer'


const AppNavigator = createStackNavigator({
  Login: { screen: LoginContainer },
  Story: { screen: StoryContainer },
  Agenda: { screen: AgendaContainer },
},
  {
    // initialRouteName: 'Story',
    headerMode: 'none'
  }
);

export default AppNavigator;
