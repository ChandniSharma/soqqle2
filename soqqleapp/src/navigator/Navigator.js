import React from 'react';
import { createStackNavigator } from 'react-navigation';
import LoginContainer from '../containers/LoginContainer';
import ProfileContainer from '../containers/ProfileContainer';
import CompanyProfileContainer from '../containers/CompanyContainer';
import StoryContainer from '../containers/StoryContainer';
import AgendaContainer from '../containers/AgendaContainer';
import UserTaskGroupContainer from '../containers/UserTaskGroupContainer';
import ChatContainer from '../containers/ChatContainer';
import DashboardContainer from '../containers/DashboardContainer';


const AppNavigator = createStackNavigator({
  Login: { screen: LoginContainer },
  Profile: { screen: ProfileContainer },
  CompanyProfile: { screen: CompanyProfileContainer },
  Story: { screen: StoryContainer },
  UserTaskGroup: { screen: UserTaskGroupContainer },
  Chat: { screen: ChatContainer },
  Agenda: { screen: AgendaContainer },
  Dashboard: { screen: DashboardContainer },
},
  {
    headerMode: 'none'
  }
);

export default AppNavigator;
