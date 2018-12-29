import React from 'react';
import {createStackNavigator} from 'react-navigation';
import LoginContainer from '../containers/LoginContainer';
import ProfileContainer from '../containers/ProfileContainer';
import CompanyProfileContainer from '../containers/CompanyContainer';
import StoryContainer from '../containers/StoryContainer';
import AgendaContainer from '../containers/AgendaContainer';
import UserTaskGroupContainer from '../containers/UserTaskGroupContainer';


const AppNavigator = createStackNavigator({
    Login: {screen: LoginContainer},
    Profile: {screen: ProfileContainer},
    CompanyProfile: {screen: CompanyProfileContainer},
    Story: {screen: StoryContainer},
    Agenda: {screen: AgendaContainer},
    UserTaskGroup: {screen: UserTaskGroupContainer},
  },
  {
    headerMode: 'none'
  }
);

export default AppNavigator;
