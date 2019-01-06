import React from 'react';
import { createStackNavigator } from 'react-navigation';
import LoginContainer from '../containers/LoginContainer';
import ProfileContainer from '../containers/ProfileContainer';
import CompanyProfileContainer from '../containers/CompanyContainer';
import StoryContainer from '../containers/StoryContainer';
import AgendaContainer from '../containers/AgendaContainer';
import UserTaskGroupContainer from '../containers/UserTaskGroupContainer';
import ChatContainer from '../containers/ChatContainer';
import AchievementContainer from '../containers/AchievementContainer';


const AppNavigator = createStackNavigator({
  Login: { screen: LoginContainer },
  Profile: { screen: ProfileContainer },
  CompanyProfile: { screen: CompanyProfileContainer },
  Story: { screen: StoryContainer },
  UserTaskGroup: { screen: UserTaskGroupContainer },
  Chat: { screen: ChatContainer },
  Agenda: { screen: AgendaContainer },
  Achievement: { screen: AchievementContainer },
},
  {
    headerMode: 'none'
  }
);

export default AppNavigator;
