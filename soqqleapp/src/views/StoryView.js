import React, {Component} from 'react';
import {
    ActivityIndicator,
    DeviceEventEmitter,
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Animated
} from 'react-native';
import Video from 'react-native-video';
import * as axios from 'axios';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import _ from 'lodash';
import TextImage from './TextImage'

import {CHALLENGE_IMAGE_BASE_URL, STORY_IMAGE_BASE_URL, STORY_VIDEO_BASE_URL, TASK_GROUP_TYPES} from '../constants';
import {API_BASE_URL} from '../config';
import {
    SAVE_USER_TASK_GROUP_API,
    TEAM_UPDATE_API,
    USER_ACHIEVEMENT_LIST_PATH_API,
    USER_TASK_GROUP_LIST_PATH_API
} from '../endpoints';
import styles from '../stylesheets/storyViewStyles';
import CustomText from "../components/CustomText";

const width = Dimensions.get('window').width; //full width

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {'Content-type': 'application/json'}
});

let selectedItemId = null;
let selectedItemType = null;
let selectedItemBonusSparks = null;

// TODO: Update this class to new Lifecycle methods
// TODO: Split this render component into smaller one
export default class StoryView extends Component {
  goToDashboardScreen = () => this.props.navigation.navigate({routeName: 'Dashboard'});
  goToProfileScreen = () => this.props.navigation.navigate({routeName: 'Profile'});
  goToUserTasksScreen = () => this.props.navigation.navigate({routeName: 'UserTaskGroup'});
  _renderItem = ({item, index}) => {

    const imageBaseUrl = item.type === TASK_GROUP_TYPES.CHALLENGE ? CHALLENGE_IMAGE_BASE_URL : STORY_IMAGE_BASE_URL;
    return (
      <View>
        <View style={item.type === TASK_GROUP_TYPES.CHALLENGE ? styles.challengeContainer : styles.storyContainer}>
          <TextImage item={item} 
                    itemIndex={index} />
          {item.sequence && <View style={{
            ...styles.storySequence,
            backgroundColor: item.type === TASK_GROUP_TYPES.STORY ? '#7362B0' : '#BA57BC'
          }}>
            <Text style={styles.sequenceText}>#{item.sequence} Of {(item.groupName || '').toUpperCase()}</Text>
          </View>}
        </View>
        <View style={styles.storyActionsContainer}>
          <TouchableOpacity onPress={() => {
            this.setModalVisible(!this.state.modalVisible, item._id, item.type, item.bonusSparks);
          }}>
            <View style={{...styles.storyActionBlock, ...{'backgroundColor': '#ffc500'}}}>
              <Image
                source={require('./../../assets/images/thumbs_up.png')}
                style={styles.storyActionIcon}
              />
            </View>
          </TouchableOpacity>
          <View style={{...styles.storyActionBlock, ...{'borderColor': '#171a54'}}}>
            <Image
              source={require('./../../assets/images/thubms_down.png')}
              style={styles.storyActionIcon}
            />
          </View>
        </View>
      </View>
    );
  };  

  getUserAchievements = async () => {
    let {user} = this.props;
    let response = await instance(USER_ACHIEVEMENT_LIST_PATH_API.replace(user._id));
    this.getChallengesAndStories(user, response.data || []);
  };

  _renderStoryTaskItem = item => {
    const data = item._typeObject;
    const teamLength = item._team.emails.length;
    return (
      <View style={{paddingHorizontal: 8}} key={item._id}>
        <TouchableOpacity
          onPress={() => this.addUserToTeam(item._team._id, item._id)}
        >
          <View style={styles.taskItem}>
            <View style={styles.taskItemHeader}>
              <Text style={styles.taskItemName} numberOfLines={2}>{data.name}</Text>
              <Text style={styles.taskItemSize}>{data.quota ? `${teamLength}/${data.quota}` : ''}</Text>
            </View>
            <View style={styles.taskItemFooter}>
              <Text style={styles.taskItemExpiry}>
                {`Expire: ${data.expiry || ''}`}
              </Text>
              <Text style={styles.taskItemXP}>100 xp</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  constructor(props) {
    super(props);    
    
    this.state = {
      challengesFetching: true,
      challengesAndStories: [],
      currentSlideIndex: 0,
      modalVisible: false,
      processing: false,
      tasksFetching: false,
      userTaskGroups: [],
      numberOfLines:2,
      storyItemTextStyle: styles.storyItemImage,
      animatedStyle:[],
      animatedHeight:new Animated.Value(styles.storyItemImage.height)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stories && !_.isEqual(nextProps.stories, this.state.challengesAndStories)) {
      let heights = new Array(nextProps.stories.length);
      heights.fill(new Animated.Value(styles.storyItemImage.height),0);
      let _storyData =  _.sortBy(nextProps.stories, ['groupName','sequence']);
      let _story = [];
      _storyData.map((data)=>{
        if(data.sequence == 1 ){
          _story.push(data)
        } else if (data.sequence == undefined){
          _story.push(data)
        }
      })
      this.setState({challengesAndStories:_story,
        animatedStyle: heights});
    }
  }

  componentDidMount() {
    if (this.props.user) {
      this.getUserAchievements();
    }
  }

  setModalVisible(visible, itemId, itemType, itemBonusSparks) {
    this.setState({modalVisible: visible, tasksFetching: !!itemId, userTaskGroups: []});
    selectedItemId = itemId;
    selectedItemType = itemType;
    selectedItemBonusSparks = itemBonusSparks;
    if (itemId) {
      this.fetchUserTaskGroupsBasedOnStory(itemId);
    }
  }

  // TODO: We should define this outside view
  fetchUserTaskGroupsBasedOnStory(storyId) {
    let endpoint = USER_TASK_GROUP_LIST_PATH_API.replace('{page}', 1);
    endpoint = endpoint.replace('{type}', selectedItemType);
    endpoint = endpoint.concat('&page_size=', 3);
    endpoint = endpoint.concat('&type_id=', storyId);
    endpoint = endpoint.concat('&user_email=', this.props.user.profile.email);
    endpoint = endpoint.concat('&filter_user=', true);
    instance.get(endpoint).then(response => {
      if (response) {
        response.data = getGroupUserDetails(response.data);
        this.setState({
          userTaskGroups: response.data.latestUserTaskGroups,
          tasksFetching: false
        });
      }

    }).catch(() => this.setState({tasksFetching: false}));
  }

  addUserToTeam(teamId, taskGroupId) {
    if (!this.state.processing) {
      this.setState({processing: true});
      let data = {email: this.props.user.profile.email, taskGroupId};

        //todo: uncomment this after successful integeration of mixpanel sdk
      // MixPanel.track('Join a team');
      fetch(TEAM_UPDATE_API.replace('{}', teamId), {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => response.json())
        .then((response) => {
          this.setState({processing: false, modalVisible: false});
          // this.props.navigation.navigate('UserTaskGroup', {reset: true});
          this.props.navigation.navigate('Chat',
            {
              task_group_id: response._id,
              taskUpdated: false,
              taskGroup: response
            }
          )
        })
        .catch(() => this.setState({processing: false}));
    }
  }

  createNewTeam() {
    if (!this.state.processing) {
      this.setState({processing: true});
      const {profile} = this.props.user;
      let data = {
        name: `${profile.firstName} - team`,
        emails: {
          'accepted': true,
          'email': profile.email
        }
      };
        //todo: uncomment this after successful integeration of mixpanel sdk
      // MixPanel.track('Create a Group')
      instance.post(TEAM_UPDATE_API.replace('{}/', ''), data).then(response => {
        this.createNewUserTaskGroup(response.data._id);
      }).catch(() => this.setState({processing: false}));
    }
  }

  createNewUserTaskGroup(teamId) {
    let data = {
      type: selectedItemType,
      _typeObject: selectedItemId,
      _user: this.props.user._id,
      _team: teamId,
      ...(selectedItemBonusSparks ? {
        leftBonusSparks: selectedItemBonusSparks,
        lastBonusSparksRefreshed: new Date()
      } : {})
    };
    fetch(SAVE_USER_TASK_GROUP_API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json())
      .then((response = {}) => {
        this.setState({processing: false, modalVisible: false});
        selectedItemId = null;
        selectedItemType = null;
        // this.props.navigation.navigate('UserTaskGroup', {reset: true});
        this.props.navigation.navigate('Chat',
          {
            task_group_id: response._id,
            taskUpdated: false,
            taskGroup: response
          }
        )
      })
      .catch(() => this.setState({processing: false}));
  }

  getChallengesAndStories(user, userAchievements) {
    let {profile} = user;
    if (profile) {
      let data = {
        emailId: profile.email,
        userId: user._id,
        achievementIds: this.getUserAchievementIds(userAchievements)
      };
      this.props.storyActions.getStoriesRequest(data);
    }
  }


  getUserAchievementIds(userAchievements) {
    return userAchievements.filter(item => item.status === 'Complete').map(item => item.achievementId);
  }

  onRequestCloseModal() {
    this.setModalVisible(!this.state.modalVisible);
  }

  render() {
    const {challengesAndStories} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('./../../assets/images/chat.png')}
            style={styles.headerIcon}
          />
          <TouchableOpacity onPress={this.goToDashboardScreen}>
            <Icon name='bars' style={styles.headerFontIcon}/>
          </TouchableOpacity>
        </View>
        <View style={styles.storyContainerView}>
            <View>
              <Carousel
                ref={c => this._carousel = c}
                data={challengesAndStories}
                renderItem={this._renderItem.bind(this)}
                sliderWidth={width}
                itemWidth={wp('90%')}
                onBeforeSnapToItem={slideIndex => this.setState({currentSlideIndex: slideIndex})}
              />
            </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={this.goToProfileScreen}>
            <View style={styles.footerTab}>
              <Icon name='th' style={styles.footerTabIcon}/>
              <CustomText
                styles={{...styles.footerTabText, ...{'marginRight': 0}}}
                font='open-sans'>
                {'Dashboard'.toUpperCase()}
              </CustomText>
            </View>
          </TouchableOpacity>
          <View style={styles.footerTab}>
            <Icon name='star' style={styles.footerTabIcon}/>
            <CustomText
              styles={{...styles.footerTabText, ...{'marginRight': 0}}}
              font='open-sans'>
              {'Story'.toUpperCase()}
            </CustomText>
          </View>
          <TouchableOpacity onPress={this.goToUserTasksScreen}>
            <View style={styles.footerTab}>
              <Icon name='tasks' style={styles.footerTabIcon}/>
              <CustomText
                styles={{...styles.footerTabText, ...{'marginRight': 0}}}
                font='open-sans'>
                {'Groups'.toUpperCase()}
              </CustomText>
            </View>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.onRequestCloseModal.bind(this)}
        >
          <View style={styles.likeModalView}>
            <View style={styles.likeModalInnerView}>
              <Text style={styles.likeModalTitle}>You like this!</Text>
              {this.state.tasksFetching ? (
                <ActivityIndicator size="small" color="#800094"/>
              ) : (
                this.state.userTaskGroups.length ? (
                  <View>
                    <Text style={styles.likeModalText}>Join a team to surge forward!</Text>
                    {this.state.userTaskGroups.map(userTaskGroup => {
                      return this._renderStoryTaskItem(userTaskGroup);
                    })}
                    <Text style={styles.likeModalSeparator}>or</Text>
                    <TouchableOpacity
                      onPress={() => this.createNewTeam()}>
                      <Text style={{
                        ...styles.likeModalAction, ...{
                          'backgroundColor': 'transparent',
                          'color': '#000000'
                        }
                      }}>
                        Start one
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.likeModalText}>But there are no available teams.</Text>
                    <TouchableOpacity
                      onPress={() => this.createNewTeam()}>
                      <Text style={styles.likeModalAction}>Start one</Text>
                    </TouchableOpacity>
                  </View>
                )
              )}
              <TouchableOpacity
                onPress={this.onRequestCloseModal.bind(this)}
                style={styles.likeModalClose}
              >
                <View>
                  <Icon name='close' style={styles.likeModalCloseIcon}/>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
