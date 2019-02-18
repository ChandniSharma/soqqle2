import React, { Component } from 'react';
import { NavigationActions, StackActions } from 'react-navigation';
import { TextInput, View, Image, DeviceEventEmitter } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import _ from 'lodash';
import {
    Body,
    Button,
    CardItem,
    Container,
    Header,
    Icon,
    Item,
    Left,
    Right,
    Text,
    Textarea,
    Thumbnail
} from 'native-base';

import { MAIN_COLOR } from '../constants';
import { USER_SPARK_LIST_PATH_API } from '../endpoints';
import styles from '../stylesheets/profileView';

// TODO: Update this class to new Lifecycle methods
export default class ProfileView extends Component {
  static flashMessage = message => {
      showMessage({ message, type: MAIN_COLOR });
  };

  onChange = (field, value) => {
      const { profile } = this.state;
      this.setState({ profile: { ...profile, [field]: value } });
  };

  onSave = () => {
      const { profile } = this.state;
      const { userActions } = this.props;
      if (!profile.firstName) {
          return ProfileView.flashMessage('Please enter your first name!');
      }
      if (!profile.lastName) {
          return ProfileView.flashMessage('Please enter your last name!');
      }
      this.setState({ isEdit: false });
      userActions.saveProfileRequest(profile);
  };

  goToCompanyDetails = profile => {
      this.props.navigation.navigate('CompanyProfile', { profile });
  };

  goBack = () => {
    DeviceEventEmitter.emit('REFRESH_STORIES',  {})
    if (this.props.backToUserList) {
          this.props.navigation.navigate('UsersList', { taskGroupData: this.props.navigation.state.params.taskGroupData });
      } else {
          this.props.navigation.pop();
      }
  };

  goAgendaView = () => this.props.navigation.navigate('Agenda');

  goUserListView = () => {
      const { userActions } = this.props;
      userActions.blockUserListRequested(this.props.user.blockUserIds);
  };

  logout = () => {
      this.menu.close();
      this.props.userActions.logout();
      const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Login' })],
      });
      this.props.navigation.dispatch(resetAction);
  };

  renderMenu = () => {
      if (this.props.backToUserList) {
          return null;
      }

      return <Menu ref={ref => this.menu = ref}>
          <MenuTrigger>
              <Icon style={styles.headerIcon} name='settings' />
          </MenuTrigger>
          <MenuOptions>
              <MenuOption onSelect={() => this.setState({ isEdit: true })}>
                  <Button transparent onPress={() => this.setState({ isEdit: true })}>
                      <Icon type="FontAwesome" style={styles.headerMenuIcon} name='pencil' />
                      <Text style={styles.headerMenuIcon}>Edit Profile</Text>
                  </Button>
              </MenuOption>
              <MenuOption>
                  <Button transparent onPress={() => this.goAgendaView()}>
                      <Icon type="FontAwesome" style={styles.headerMenuIcon} name='calendar' />
                      <Text style={styles.headerMenuIcon}>Agenda</Text>
                  </Button>
              </MenuOption>
              <MenuOption>
                  <Button transparent onPress={() => this.goUserListView()}>
                      <Image style={styles.blockIcon} source={require('../../assets/images/eyeCross.png')} />
                      <Text style={styles.headerMenuIcon}>View Block User</Text>
                  </Button>
              </MenuOption>
              <MenuOption onSelect={() => this.logout()}>
                  <Button transparent onPress={this.logout}>
                      <Icon type="FontAwesome" style={styles.headerMenuIcon} name='sign-out' />
                      <Text style={styles.headerMenuIcon}>Exit</Text>
                  </Button>
              </MenuOption>
          </MenuOptions>
      </Menu>;
  };

  constructor(props) {
      super(props);
      this.state = {
          isEdit: false,
          profile: props.user.profile || {},
          companies: props.companies || [],
          tokensCount: this.props.sparks.tokensCount || 0,
      };
  }

  componentWillMount() {
      if (!Object.keys(this.props.sparks).length) {
          const endpoint = USER_SPARK_LIST_PATH_API.replace('{}', this.props.user._id);
          this.props.sparkActions.getSparksRequest({ initialLoad: true, endpoint });
      }
  }

  componentDidMount() {
      const { userActions } = this.props;
      const { profile } = this.state;
      if (profile && profile.email) {
          userActions.getCompaniesRequest(profile.email.toLowerCase());
      }
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.user && !_.isEqual(nextProps.user.profile, this.state.profile) && !nextProps.isLoading) {
          this.setState({ profile: nextProps.user.profile });
      }
      if (nextProps.companies && !_.isEqual(nextProps.companies, this.state.companies)) {
          this.setState({ companies: nextProps.companies });
      }
      if (Object.keys(nextProps.sparks).length
      && (!this.props.sparks.transactions ||
        nextProps.sparks.transactions.length != this.props.sparks.transactions.length)) {
          this.setState({ tokensCount: nextProps.sparks.tokensCount });
      }
      if(nextProps.blockUserListSuccess && nextProps.blockUserListSuccess != this.props.blockUserListSuccess ){
          this.props.navigation.navigate('UsersList',{blockUserList:nextProps.blockUserList});
      }
  }

  render() {
      const { profile, companies, isEdit } = this.state;
      return (
          <MenuProvider>
              <Container>
                  <Header transparent style={styles.blurBg}>
                      <Left>
                          <Button transparent onPress={this.goBack}>
                              <Icon style={styles.headerIcon} name='arrow-back' />
                          </Button>
                      </Left>
                      <Right>
                          {isEdit ?
                              <Button transparent onPress={this.onSave}><Text
                                  style={styles.headerIcon}>save</Text></Button> : this.renderMenu()}
                      </Right>
                  </Header>
                  <View style={styles.topProfile}>
                      <CardItem style={styles.blurBg}>
                          <Left>
                              <Thumbnail
                                  style={styles.avatar}
                                  source={{ uri: profile.pictureURL ||
                                      `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}` }} />
                              <Body>
                                  {isEdit ? <Item>
                                      <TextInput placeholder="First Name" onChangeText={value => this.onChange('firstName', value)}
                                          style={[styles.input, styles.inputName]}
                                          value={profile.firstName} />
                                      <TextInput placeholder="Last Name" onChangeText={value => this.onChange('lastName', value)}
                                          style={[styles.input, styles.inputName]}
                                          value={profile.lastName} />
                                  </Item> : <Text style={styles.inputName}>{`${profile.firstName} ${profile.lastName || ''}`}</Text>
                                  }
                                  {isEdit ?
                                      <TextInput placeholder="Title" onChangeText={value => this.onChange('title', value)}
                                          style={styles.input}
                                          value={profile.title} /> : <Text note>{profile.title || ''}</Text>}
                                  {!isEdit && (<View style={styles.profileStats}>
                                      <Icon name='star' style={styles.profileTokenIcon} />
                                      <Text style={styles.profileTokenText}>{this.state.tokensCount}</Text>
                                  </View>)}
                              </Body>
                          </Left>
                      </CardItem>
                      <CardItem style={styles.blurBg}>
                          <Body>
                              {isEdit ? <Textarea placeholder="Type your bio" onChangeText={value => this.onChange('bio', value)}
                                  value={profile.bio} /> :
                                  <Text>{profile.bio}</Text>}
                          </Body>
                      </CardItem>
                      <CardItem style={styles.blurBg}>
                          {
                              companies.map((company, index) =>
                                  <Button key={`company_${index}`} onPress={() => this.goToCompanyDetails(company)} small rounded
                                      style={styles.companyButton}>
                                      <Text style={{ color: MAIN_COLOR }}>{company.name}</Text>
                                  </Button>)
                          }
                      </CardItem>
                  </View>
              </Container>
          </MenuProvider>
      );
  }
}
