import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import _ from 'lodash';
import {MAIN_COLOR} from "../constants";
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

export default class ProfileView extends Component {

  static flashMessage = message => {
    showMessage({message, type: MAIN_COLOR});
  };
  onChange = (field, value) => {
    const {profile} = this.state;
    this.setState({profile: {...profile, [field]: value}});
  };
  onSave = () => {
    const {profile} = this.state;
    const {userActions} = this.props;
    if (!profile.firstName) {
      return ProfileView.flashMessage('Please enter your first name!');
    }
    if (!profile.lastName) {
      return ProfileView.flashMessage('Please enter your last name!');
    }
    this.setState({isEdit: false});
    userActions.saveProfileRequest(profile);
  };
  goBack = () => {
    this.props.navigation.pop();
  };

  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      profile: props.user.profile || {},
      companies: props.companies || []
    };
  }

  componentDidMount() {
    const {userActions} = this.props;
    const {profile} = this.state;
    if (profile && profile.email) {
      userActions.getCompaniesRequest(profile.email.toLowerCase());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !_.isEqual(nextProps.user.profile, this.state.profile) && !nextProps.isLoading) {
      this.setState({profile: nextProps.user.profile});
    }
    if (nextProps.companies && !_.isEqual(nextProps.companies, this.state.companies)) {
      this.setState({companies: nextProps.companies});
    }
  }

  render() {
    const {profile, companies, isEdit} = this.state;
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={this.goBack}>
              <Icon style={{fontSize: 25}} color="black" name='arrow-back'/>
            </Button>
          </Left>
          <Body>
          <Title>Profile</Title>
          </Body>
          <Right>
            {isEdit ? <Button transparent>
                <Button transparent onPress={this.onSave}><Text>Save</Text></Button></Button> :
              <Button onPress={() => this.setState({isEdit: true})} transparent><Icon style={{fontSize: 25}}
                                                                                      type="FontAwesome" color="black"
                                                                                      name='pencil'/></Button>}

          </Right>
        </Header>
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail
                  source={{uri: 'https://s3.us-east-2.amazonaws.com/admin.soqqle.com/userProfile/avatar_1541645735271'}}/>
                <Body>
                {isEdit ? <Item>
                  <Input placeholder="First Name" onChangeText={value => this.onChange('firstName', value)} style={styles.input}
                         value={profile.firstName}/>
                  <Input placeholder="Last Name" onChangeText={value => this.onChange('lastName', value)} style={styles.input}
                         value={profile.lastName}/>
                </Item> : <Text>{`${profile.firstName} ${profile.lastName || ''}`}</Text>
                }
                {isEdit ? <Input placeholder="Title" onChangeText={value => this.onChange('title', value)} style={styles.input}
                                 value={profile.title}/> : <Text note>{profile.title || ''}</Text>}
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
              {isEdit ? <Textarea placeholder="Type your bio" onChangeText={value => this.onChange('bio', value)} value={profile.bio}/> :
                <Text>{profile.bio}</Text>}
              </Body>
            </CardItem>
            <CardItem style={{flex: 1, justifyContent: 'space-between'}}>
              {
                companies.map((company, index) =>
                  <Button key={`company_${index}`} small rounded style={{backgroundColor: MAIN_COLOR}}>
                    <Text style={{color: 'white'}}>{company.name}</Text>
                  </Button>)
              }
            </CardItem>
          </Card>
          <Card>
            <CardItem cardBody>
              <Image
                source={{uri: 'https://www.wikihow.com/images/5/51/Keep-Halloween-Pumpkins-from-Molding-Step-13-Version-2.jpg'}}
                style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Body>
              <Text>Completed the Superwomen Achievement!</Text>
              <Text>You need 5 more illuminates to complete this.</Text>
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem cardBody>
              <Image
                source={{uri: 'https://www.wikihow.com/images/7/7a/Make-Gratin-Dauphinoise-Without-Cream-Step-12.jpg'}}
                style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Body>
              <Text>Started the blockchain intermeditate project !</Text>
              <Button small rounded danger>
                <Text>Join Jan</Text>
              </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 20,
    fontSize: 15,
    marginLeft: 10,
  }
});
