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

  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      profile: props.navigation.getParam('profile', {}),
    };
  }

  static flashMessage = message => {
    showMessage({message, type: MAIN_COLOR});
  };

  onChange = (field, value) => {
    const {profile} = this.state;
    this.setState({profile: {...profile, [field]: value}});
  };
  onSave = () => {
    const {profile} = this.state;
    const {companyActions} = this.props;
    if (!profile.name) {
      return ProfileView.flashMessage('Please enter company name!');
    }
    if (!profile.title) {
      return ProfileView.flashMessage('Please enter company title!');
    }
    if (!profile.description) {
      return ProfileView.flashMessage('Please enter description!');
    }
    this.setState({isEdit: false});
    companyActions.saveCompanyRequest(profile);
  };
  goBack = () => {
    this.props.navigation.pop();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.details && !_.isEqual(nextProps.details, this.state.profile) && !nextProps.isLoading) {
      this.setState({profile: nextProps.details});
    }
  }

  render() {
    const {profile, isEdit} = this.state;
    return (
      <Container>
        <Header transparent>
          <Left>
            <Button transparent onPress={this.goBack}>
              <Icon style={{fontSize: 25}} color="black" name='arrow-back'/>
            </Button>
          </Left>
          <Body>
          <Title>Company</Title>
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
          <Content>
            <CardItem>
              <Left>
                <Thumbnail
                  source={{uri: profile.imageUrl || `https://ui-avatars.com/api/?name=${profile.name}`}}/>
                <Body>
                {isEdit ? <Item>
                  <Input placeholder="Name" onChangeText={value => this.onChange('name', value)} style={styles.input}
                         value={profile.name}/>
                </Item> : <Text>{profile.name}</Text>
                }
                {isEdit ? <Input placeholder="Title" onChangeText={value => this.onChange('title', value)} style={styles.input}
                                 value={profile.title}/> : <Text note>{profile.title || ''}</Text>}
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
              {isEdit ? <Textarea placeholder="Type company description" onChangeText={value => this.onChange('description', value)} value={profile.description}/> :
                <Text>{profile.description}</Text>}
              </Body>
            </CardItem>
          </Content>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail
                  small
                  source={{uri: 'https://s3.us-east-2.amazonaws.com/admin.soqqle.com/userProfile/avatar_1541645735271'}}/>
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
            <CardItem>
              <Left>
                <Thumbnail
                  small
                  source={{uri: 'https://s3.us-east-2.amazonaws.com/admin.soqqle.com/userProfile/avatar_1541645735271'}}/>
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
