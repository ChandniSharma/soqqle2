import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View,
  SafeAreaView, Dimensions, ScrollView, TouchableWithoutFeedback
} from 'react-native';
import Header from './../components/Header';

import AchievementView from './AchievementView';
import LevelView from './LevelView';
import SparkView from './SparkView';

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;
var width = Dimensions.get('window').width; //full width

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingTop: statusBarHeight,
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'column'
  },
  contentView: {
    flex: 1,
    backgroundColor: '#2C2649',
    padding: 0,
  },
  tabContainer: {
    backgroundColor: '#130C38',
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 17,
    paddingVertical: 15,
    paddingHorizontal: 20,
  }
});

const tabs = [
  {
    key: 'rewards',
    label: 'Rewards',
  },
  {
    key: 'achievements',
    label: 'Achievements',
  },
  {
    key: 'levels',
    label: 'Levels',
  },
  {
    key: 'sparks',
    label: 'Sparks',
  }
]

export default class DashboardView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'achievements',
    }
  }

  render() {
    const { selectedTab } = this.state;
    const { props } = this;
    const components = {
      rewards: <Text style={{ color: '#fff' }}>Rewards coming soon..</Text>,
      achievements: (<AchievementView {...props} />),
      levels: (<LevelView {...props} />),
      sparks: (<SparkView {...props} />)
    }
    return (
      <SafeAreaView style={styles.container}>
        <Header navigation={this.props.navigation}
          headerStyle={{
            elevation: 0
          }} />
        <View style={styles.contentView}>
          <View style={styles.tabContainer}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {tabs.map(tab => {
                return (
                  <TouchableWithoutFeedback
                    key={tab.key}
                    onPress={() => { this.setState({ selectedTab: tab.key }) }}>
                    <Text
                      style={tab.key === selectedTab ?
                        { ...styles.tabLabel, ...{ 'color': '#ffffff' } } :
                        styles.tabLabel}
                    >{tab.label}</Text>
                  </TouchableWithoutFeedback>
                )
              })}
            </ScrollView>
          </View>
          {components[this.state.selectedTab]}
        </View>
      </SafeAreaView>
    );
  }
}
