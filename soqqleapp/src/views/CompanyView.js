import React, { Component } from 'react';
import { Image, StyleSheet, View, StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import _ from 'lodash';
import { MAIN_COLOR } from "../constants";
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Header,
  Icon,
  Input,
  Item,
  Left,
  Right,
  Text,
  Textarea,
  Thumbnail,
  Title
} from "native-base";

import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption, MenuProvider
} from 'react-native-popup-menu'

export default class ProfileView extends Component {

  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content', true);
    this.state = {
      isEdit: false,
      profile: props.navigation.getParam('profile', {}),
    };
  }

  static flashMessage = message => {
    showMessage({ message, type: MAIN_COLOR });
  };

  onChange = (field, value) => {
    const { profile } = this.state;
    this.setState({ profile: { ...profile, [field]: value } });
  };
  onSave = () => {
    const { profile } = this.state;
    const { companyActions } = this.props;
    if (!profile.name) {
      return ProfileView.flashMessage('Please enter company name!');
    }
    if (!profile.title) {
      return ProfileView.flashMessage('Please enter company title!');
    }
    if (!profile.description) {
      return ProfileView.flashMessage('Please enter description!');
    }
    this.setState({ isEdit: false });
    companyActions.saveCompanyRequest(profile);
  };
  goBack = () => {
    this.props.navigation.pop();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.details && !_.isEqual(nextProps.details, this.state.profile) && !nextProps.isLoading) {
      this.setState({ profile: nextProps.details });
    }
  }

  goAgendaView = () => {
    this.props.navigation.navigate("Agenda");
  }

  renderMenu = () => {
    return (
      <Menu ref={ref => this.menu = ref}>
        <MenuTrigger>
          <Icon style={styles.headerIcon} type="FontAwesome" color="black" name='pencil' />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption>
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
        </MenuOptions>
      </Menu>
    )
  }

  render() {
    const { profile, isEdit } = this.state;
    return (
      <MenuProvider>
        <Container>
          <Header transparent style={styles.blurBg}>
            <Left>
              <Button transparent onPress={this.goBack}>
                <Icon style={styles.headerIcon} color="black" name='arrow-back' />
              </Button>
            </Left>
            <Right>
              {isEdit ? <Button transparent>
                <Button transparent onPress={this.onSave}><Text style={styles.headerIcon}>save</Text></Button></Button> :
                this.renderMenu()
              }

            </Right>
          </Header>
          <View style={styles.topProfile}>
            <CardItem style={styles.blurBg}>
              <Left>
                <Thumbnail
                  style={styles.avatar}
                  source={{ uri: profile.imageUrl || `https://ui-avatars.com/api/?name=${profile.name}` }} />
                <Body>
                  {isEdit ? <Item>
                    <Input placeholder="Name" onChangeText={value => this.onChange('name', value)}
                      style={[styles.input, styles.inputName]}
                      value={profile.name} />
                  </Item> : <Text style={styles.inputName}>{`${profile.name}`}</Text>
                  }
                  {isEdit ?
                    <Input placeholder="Title" onChangeText={value => this.onChange('title', value)} style={styles.inputTitle}
                      value={profile.title} /> : <Text style={styles.inputTitle} note>{profile.title || ''}</Text>}
                </Body>
              </Left>
            </CardItem>
            <CardItem style={styles.blurBg}>
              <Body>
                {isEdit ? <Textarea placeholder="Company description" style={styles.inputDescription} onChangeText={value => this.onChange('description', value)}
                  value={profile.description} /> :
                  <Text style={styles.inputDescription}>{profile.description}</Text>}
              </Body>
            </CardItem>
          </View>
          <Content style={{ backgroundColor: '#2C2649', paddingTop: 5 }}>
            <Card style={styles.card}>
              <CardItem style={styles.card}>
                <Left>
                  <Thumbnail
                    small
                    source={{ uri: 'https://s3.us-east-2.amazonaws.com/admin.soqqle.com/userProfile/avatar_1541645735271' }} />
                  <Body>
                    <Text>Jane Smith</Text>
                  </Body>
                </Left>
                <Right>
                  <Text>5 Mins</Text>
                </Right>
              </CardItem>
              <CardItem cardBody>
                <Image
                  source={{ uri: 'https://www.wikihow.com/images/5/51/Keep-Halloween-Pumpkins-from-Molding-Step-13-Version-2.jpg' }}
                  style={{ height: 200, width: null, flex: 1 }} />
              </CardItem>
              <CardItem>
                <Text>Completed the Superwomen Achievement!</Text>
              </CardItem>
              <CardItem>
                <Text>You need 5 more illuminates to complete this.</Text>
              </CardItem>
            </Card>
            <Card style={styles.card}>
              <CardItem style={styles.card}>
                <Left>
                  <Thumbnail
                    small
                    source={{ uri: 'https://s3.us-east-2.amazonaws.com/admin.soqqle.com/userProfile/avatar_1541645735271' }} />
                  <Body>
                    <Text>Jane Smith</Text>
                  </Body>
                </Left>
                <Right>
                  <Text>10 Mins</Text>
                </Right>
              </CardItem>
              <CardItem cardBody>
                <Image
                  source={{ uri: 'https://www.wikihow.com/images/7/7a/Make-Gratin-Dauphinoise-Without-Cream-Step-12.jpg' }}
                  style={{ height: 200, width: null, flex: 1 }} />
              </CardItem>
              <CardItem>
                <Text>Started the blockchain intermeditate project !</Text>
              </CardItem>
              <CardItem style={styles.card}>
                <Left>
                  <Button small rounded style={styles.joinButton}>
                    <Text>Join Jan</Text>
                  </Button>
                </Left>
                <Right>
                  <Text style={styles.buttonExt}>4/5 Slots</Text>
                </Right>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  topProfile: {
    paddingBottom: 20,
    backgroundColor: '#130C38',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  blurBg: {
    backgroundColor: '#130C38'
  },
  headerIcon: {
    fontSize: 25,
    color: 'white'
  },
  headerMenuIcon: {
    fontSize: 15,
    color: 'black'
  },
  avatar: {
    width: 60,
    height: 60,
  },
  inputName: {
    fontSize: 20,
    color: 'white'
  },
  inputTitle: {
    color: '#1FBEB8',
    fontSize: 13
  },
  inputDescription: {
    fontSize: 13,
    color: '#AEAEAE'
  },
  input: {
    height: 20,
    fontSize: 15,
    marginLeft: 10,
  },
  joinButton: {
    marginTop: 5,
    backgroundColor: MAIN_COLOR
  },
  card: {
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 10,
  },
  buttonExt: {
    color: '#8C7DDA'
  }
});
