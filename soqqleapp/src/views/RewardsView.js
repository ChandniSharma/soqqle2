import React from 'react'
import {Text, View, ScrollView, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import Accordion from 'react-native-collapsible/Accordion';

import * as axios from 'axios';
import { API_BASE_URL } from './../config';
import { USER_ACHIEVEMENT_LIST_PATH_API } from './../endpoints';

const SECTIONS = [
  {
    id: 0,
    title: 'Company',
    content: ['Company 1', 'Company 2', 'Company 3']
  },
  {
    id: 1,
    title: 'Tokens',
    content: ['Token 1', 'Token 2', 'Token 3']
  },
  {
    id: 2,
    title: 'Category',
    content: ['Category 1', 'Category 2', 'Category 3']
  },
];

const rewardsImg = require('../../assets/images/rewardsImg.png')

const screenWidth = Dimensions.get('window').width;

let userId = null;

function generateAchievementGroups(data) {
  return data.map(item => {
    return {
      'id': item._id,
      'name': item.name,
      'scope': item.scope,
      'achievements': item._achievements
    }
  })
}

export default class RewardsView extends React.Component {
  constructor(props) {
    super(props);

    this.sortByText = React.createRef();

    this.state = {
      activeSections: [],
      sortByClicked: false,
      sortBy: '',
      rewardsListData: [ ],
      sorter: '_id',
      userAchievements: [],
      achievements: []
    };
    userId = this.props.user._id || null;
  }


  async fetchUserAchievements() {
    if (userId) {

      const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 25000,
        headers: { 'Content-type': 'application/json' }
      });

      let endpoint = USER_ACHIEVEMENT_LIST_PATH_API.replace('{}', userId);
      await instance.get(endpoint).then(response => {
        this.setState({ userAchievements: response.data.achievements || [] })
      }).catch(err => { })

    }
  }

  _renderHeader = section => {
    const isActive = this.state.activeSections[0] === section.id;
    return (
      <View style={styles.header}>
        <Text style={{...styles.headerText, color: !isActive ? '#FFFFFF' : '#1FBEB8'}}>{section.title}</Text>
        <Text style={styles.headerTriangle}>{isActive ? '▲' : '▼'}</Text>
      </View>
    );
  };

  _renderSectionContentItem = ({item}) => {
    return (
      <View style={styles.sectionContentItemWrapper}>
        <TouchableOpacity onPress={() => this.onPressSectionContentItem(item)}>
          <Text style={styles.sectionContentItemText}>{item}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  onPressSectionContentItem = (item) => {
    this.setState({
      sortBy: item,
      sortByClicked: false
    });
  }

  _renderContent = section => {
    return (
      <View style={styles.content}>
        <FlatList style={styles.sectionContentList} 
          data={section.content}
          renderItem={this._renderSectionContentItem}
        />
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  renderRewardsItem = ({item}) => {
    return (
      <View style={styles.rewardsWrapper}>
        <Image style={styles.rewardsImg} source={rewardsImg} />
        <View style={styles.rewardsInfo}>
          <View style={styles.rewardsHeader}>
            <Text style={styles.rewardsName}>{item.name}</Text>
            <Text style={styles.rewardsSparks}>{item.sparks + ' Sparks'}</Text>
          </View>
          <Text style={styles.rewardsDescription}>{item.description}</Text>
          {item.state === "Completed" ? 
          <TouchableOpacity style={{width: 70, marginLeft: screenWidth - 125}}><Text style={styles.buyReward}>Buy</Text></TouchableOpacity> : 
          <Text style={styles.rewardsState}>{item.state}</Text>}
        </View>
      </View>
    )
  }

  onPressSortBy = () => {
    this.setState({sortByClicked: !this.state.sortByClicked});
  }

  componentWillMount() {
    this.props.rewardsActions.getRewardsRequest({ initialLoad: true, userId: userId });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rewards.rewards.length && (!this.props.rewards.details || nextProps.sparks.details.length != this.props.sparks.details.length)) {
      
      let rewards = nextProps.rewards.rewards.map((item) => {
        let state = "In Progress";
        if(item.requirement === 'Achievement') {
          const achievement = nextProps.rewards.achievements.find((ac) => {return ac.achievementId === item.requirementValue});
          if(achievement.conditions[0].counter === 0) {
            state = "Not Started";
          } else if(achievement.conditions[0].counter >= achievement.conditions[0].count) {
            state = "Completed";
          }
        } else if(item.requirement === 'Story') {
          const story = nextProps.rewards.stories.find((ac) => {return ac._id === item.requirementValue});
          if(story._achievements.length === 0) {
            state = "No Achievement";
          } else {
            const achievement = nextProps.rewards.achievements.find((ac) => {return ac.achievementId === story._achievements[0]._id});
            if(achievement.conditions[0].counter === 0) {
              state = "Not Started";
            } else if(achievement.conditions[0].counter >= achievement.conditions[0].count) {
              state = "Completed";
            }
          }
        }
        const reward = {
          name: item.name,
          description: item.description,
          sparks: item.sparks,
          state: state
        };

        return reward;
      })

      this.setState({ rewardsListData: rewards });
    }

  }
  
  render = () => {
    const bottomRadius = this.state.sortByClicked ? 0 : 5
    const sortButtonBorder = {
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      borderBottomLeftRadius: bottomRadius,
      borderBottomRightRadius: bottomRadius
    }
    const accordionBorder = {
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderTopLeftRadius: bottomRadius,
      borderTopRightRadius: bottomRadius
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.rewardsScrollView}>
          <TouchableOpacity style={{...styles.sortByButton, ...sortButtonBorder}} onPress={this.onPressSortBy}>
            <View style={styles.sortByWrapper}>
              <View style={styles.sortByTextWrapper}>
                <Text style={styles.sortByText}>Sort By</Text>
                <Text style={styles.sortBy}>{'  ' + this.state.sortBy}</Text>
              </View>
              <Text style={styles.triangle}>{this.state.sortByClicked ? '▲' : '▼' }</Text>
            </View>
          </TouchableOpacity>
        
          {this.state.sortByClicked && 
            <Accordion
              sections={SECTIONS}
              activeSections={this.state.activeSections}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              onChange={this._updateSections}
              style={{...styles.accordion, ...accordionBorder}}
            />
          }

          <FlatList style={styles.rewardsList}
            data={this.state.rewardsListData}
            renderItem={this.renderRewardsItem}
          />

        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2649',
  },
  rewardsScrollView: {
    flex: 1,
    backgroundColor: '#2C2649',
    margin: 16
  },
  sortByButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 2
  },
  sortByWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  sortByText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'SF Pro Text',
    lineHeight: 15,
    textAlign: 'center'
  },
  sortBy: {
    color: '#2FBEB8',
    fontSize: 15,
    textAlign: 'center'
  },
  sortByTextWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  triangle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'SF Pro Text',
    lineHeight: 15
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  headerText: {
    color: '#FFFFFF'
  },
  headerTriangle: {
    color: '#ffffff'
  },
  rewardsImg: {
    width: screenWidth - 32,
    height: screenWidth - 32,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  rewardsInfo: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rewardsName: {
    fontFamily: 'SF UI Display',
    fontSize: 17,
    color: '#000000',
    fontWeight: 'bold'
  },
  rewardsSparks: {
    fontFamily: 'SF UI Display',
    fontSize: 18,
    color: '#9600A1',
    fontWeight: 'bold'
  },
  rewardsDescription: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: 'rgba(0, 0, 0, 0.5)'
  },
  rewardsState: {
    fontFamily: 'SF UI Display',
    fontSize: 15,
    color: '#1FBEB8',
    textAlign: 'right',
    width: '100%',
    fontWeight: 'bold'
  },
  rewardsWrapper: {
    marginTop: 10,
    borderRadius: 5
  },
  accordion: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionContentList: {
    marginLeft: 50,
    marginBottom: 10
  },
  sectionContentItemText: {
    color: 'rgba(255, 255, 255, 0.5)'
  },
  sectionContentItemWrapper: {
    margin: 5,
  },
  buyReward: {
    margin: 5,
    padding: 10,
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#1FBEB8',
    overflow: 'hidden',
    backgroundColor: '#1FBEB8',
    color: '#FFFFFF'
  }
})
