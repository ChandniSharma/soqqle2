import React, {Component} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Video from 'react-native-video';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import {STORY_IMAGE_BASE_URL, STORY_VIDEO_BASE_URL} from './../constants';
import {SAVE_USER_TASK_GROUP_API, STORIES_LIST_API, STORY_HAS_VIDEO_API} from './../endpoints';
import CustomText from './../components/CustomText';

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingTop: statusBarHeight,
    backgroundColor: '#10123b',
    flex: 1
  },
  header: {
    height: hp('8%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#800094',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
  },
  headerIcon: {
    width: wp('8%'),
    height: hp('4%'),
  },
  storyContainerView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('4%'),
    height: hp('82%'),
  },
  storyContainer: {
    backgroundColor: '#171a54',
    width: wp('90%'),
  },
  storyItemImage: {
    alignSelf: 'center',
    width: '100%',
    height: hp('35%'),
  },
  storyItemVideo: {
    alignSelf: 'center',
    width: '100%',
    height: hp('35%'),
  },
  storyContent: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2.5%'),
  },
  storyItemText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: wp('4.6%'),
    minHeight: 80,
  },
  storyTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: hp('2.5%'),
  },
  storyTag: {
    backgroundColor: '#111e4a',
    color: '#ffc500',
    padding: wp('2%'),
    fontSize: wp('3.5%'),
    marginBottom: hp('1%'),
    fontWeight: '700'
  },
  storyActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: hp('3%'),
  },
  storyActionBlock: {
    borderRadius: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  storyActionIcon: {
    width: wp('8%'),
    height: hp('4%'),
  },
  footer: {
    backgroundColor: '#800094',
    height: hp('10%'),
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTabIcon: {
    width: wp('6%'),
    height: hp('3%'),
  },
  footerTabText: {
    color: '#fff',
    paddingTop: hp('1%'),
    fontSize: wp('3.5%'),
    fontWeight: '700',
  },
  likeModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  likeModalInnerView: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 25,
    paddingHorizontal: 10,
    width: '90%',
    borderRadius: 5,
  },
  likeModalTitle: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  likeModalText: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  likeModalAction: {
    backgroundColor: '#2C2649',
    color: '#ffffff',
    fontSize: 17,
    paddingTop: 5,
    paddingBottom: 8,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'center'

  },
  likeModalClose: {
    position: 'absolute',
    padding: 10,
    right: 5,
    top: 0
  },
  likeModalCloseIcon: {
    color: '#333333',
    fontSize: 20,
  }
});

let selectedItemId = null;

export default class StoryView extends Component {

  _renderItem = ({item, index}) => {
    return (
      <View>
        <View style={styles.storyContainer}>
          {item.has_video && this.state.currentSlideIndex === index ? (
            <Video
              ref={(ref) => {
                this.player = ref;
              }}
              source={{uri: STORY_VIDEO_BASE_URL.replace('{}', item._id)}}
              resizeMode={"cover"}
              controls={true}
              volume={1.0}
              rate={1.0}
              style={styles.storyItemVideo}
            />
          ) : (
            <Image
              source={{uri: STORY_IMAGE_BASE_URL.replace('{}', item._id)}}
              style={styles.storyItemImage}
              resizeMode='cover'
            />
          )}
          <View style={styles.storyContent}>
            <CustomText loading={this.state.loading}
                        styles={styles.storyItemText}
                        numberOfLines={3}
                        font='open-sans'>
              {item.description}
            </CustomText>
            <View style={styles.storyTagContainer}>
              {item._objective ? (
                <CustomText loading={this.state.loading}
                            styles={styles.storyTag}
                            font='open-sans'>
                  {`${item._objective.value} ${item._objective.name.toUpperCase()}`}
                </CustomText>
              ) : null}
              <CustomText loading={this.state.loading}
                          styles={styles.storyTag}
                          font='open-sans'>
                {`0/${item.quota || 0} ${item.refresh.toUpperCase()}`}
              </CustomText>
              {item.reward ? (
                <CustomText loading={this.state.loading}
                            styles={{...styles.storyTag, ...{'marginRight': 0}}}
                            font='open-sans'>
                  {`${item.reward.value} ${item.reward.type.toUpperCase()}`}
                </CustomText>
              ) : null}
            </View>
          </View>
        </View>
        <View style={styles.storyActionsContainer}>
          <TouchableOpacity onPress={() => {
            this.setModalVisible(!this.state.modalVisible, item._id);
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

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      stories: [],
      currentSlideIndex: 0,
      modalVisible: false,
      processing: false
    };
  }

  componentWillMount() {
    this.getStories();
  }

  goToProfileScreen = () => {
    this.props.navigation.navigate({routeName: 'Profile'})
  }

  setModalVisible(visible, itemId) {
    this.setState({modalVisible: visible});
    selectedItemId = itemId;
  }

  createNewUserTaskGroup() {
    if (!this.state.processing) {
      this.setState({processing: true});
      let data = {
        type: 'Story',
        _typeObject: selectedItemId,
        _user: this.props.user._id
      };
      fetch(SAVE_USER_TASK_GROUP_API, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then((response) => JSON.stringify(response.json()))
        .then((responseData) => {
          this.setState({processing: false, modalVisible: false});
          selectedItemId = null;
          this.props.navigation.navigate({routeName: 'UserTaskGroup'});
        })
        .catch((error) => {
          this.setState({processing: false});
        });
    }
  }

  getStories() {
    return fetch(STORIES_LIST_API)
      .then((response) => response.json())
      .then((responseJson) => {
        this.mapStoriesWithVideo(responseJson);
      })
      .catch((error) => {
        return [];
      });
  }

  mapStoriesWithVideo(stories) {
    const results = stories.map(async story => {
      return fetch(STORY_HAS_VIDEO_API.replace('{}', story._id))
        .then((response) => response.json())
        .then((responseJson) => {
          return {...story, ...{'has_video': true}};
        })
        .catch((error) => {
          return {...story, ...{'has_video': false}};
        });
    });
    Promise.all(results).then((completed) => {
      this.setState({stories: completed, loading: false});
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('./../../assets/images/chat.png')}
            style={styles.headerIcon}
          />
          <TouchableOpacity onPress={this.goToProfileScreen}>
            <Image
              source={require('./../../assets/images/menu.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.storyContainerView}>
          {this.state.loading ? (
            <ActivityIndicator size="large" color="#800094"/>
          ) : (
            <View>
              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                data={this.state.stories}
                renderItem={this._renderItem}
                sliderWidth={width}
                itemWidth={wp('90%')}
                onBeforeSnapToItem={(slideIndex) => this.setState({currentSlideIndex: slideIndex})}
              />
            </View>
          )}
        </View>
        <View style={styles.footer}>
          <View style={styles.footerTab}>
            <Image
              source={require('./../../assets/images/dashboard.png')}
              style={styles.footerTabIcon}
            />
            <CustomText loading={this.state.loading}
                        styles={{...styles.footerTabText, ...{'marginRight': 0}}}
                        font='open-sans'>
              {'Dashboard'.toUpperCase()}
            </CustomText>
          </View>
          <View style={styles.footerTab}>
            <Image
              source={require('./../../assets/images/story.png')}
              style={styles.footerTabIcon}
            />
            <CustomText loading={this.state.loading}
                        styles={{...styles.footerTabText, ...{'marginRight': 0}}}
                        font='open-sans'>
              {'Story'.toUpperCase()}
            </CustomText>
          </View>
          <View style={styles.footerTab}>
            <Image
              source={require('./../../assets/images/task.png')}
              style={styles.footerTabIcon}
            />
            <CustomText loading={this.state.loading}
                        styles={{...styles.footerTabText, ...{'marginRight': 0}}}
                        font='open-sans'>
              {'Task'.toUpperCase()}
            </CustomText>
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.likeModalView}>
            <View style={styles.likeModalInnerView}>
              <Text style={styles.likeModalTitle}>You like this!</Text>
              <Text style={styles.likeModalText}>But there are no available teams.</Text>
              <TouchableOpacity
                onPress={() => this.createNewUserTaskGroup()}>
                <Text style={styles.likeModalAction}>Start one</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
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
