import React, {Component} from 'react';
import {Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Header from './../components/Header';


const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingTop: statusBarHeight,
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'column'
  },
  storyDetailView: {
    paddingVertical: 15,
    paddingTop: 5,
    paddingHorizontal: 15,
    backgroundColor: '#F8F8F8',
  },
  storyDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storyDetailTitle: {
    fontSize: 18,
    color: '#000000',
    width: '70%',
    fontWeight: '400'
  },
  storyDetailXP: {
    fontSize: 16,
    color: '#9600A1',
    fontWeight: '500'
  },
  storyDetailText: {
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000'
  },
  storyDetailTagTitle: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400'
  },
  storyDetailTags: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storyDetailTag: {
    color: '#9600A1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#9600A1',
    marginRight: 8,
  },
  storyDetailActionTag: {
    color: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#1FBEB8'
  },
  chatView: {
    flex: 1,
    flexDirection: 'column',
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    elevation: 5,
  },
  chatItemsView: {
    flex: 1,
    padding: 15,
  },
  chatItem: {
    width: '100%',
    marginBottom: 10,
  },
  chatActionView: {
    height: 50,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  chatAttachmentIcon: {
    color: '#cccccc',
    fontSize: 20,
    marginRight: 15,
  },
  chatInputItem: {
    height: 30,
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 10,
    width: '80%',
    paddingVertical: 0,
    paddingHorizontal: 10,
  }
});

export default class UserTaskGroupView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      taskGroup: {}
    };
  }

  componentWillMount() {
    let id = this.props.navigation.state.params.task_group_id;
    let taskGroup = id && this.props.taskGroups.taskGroups.filter(t => {
      return t._id === id;
    })[0] || [];
    this.setState({taskGroup});
  }

  goToTask = (story) => {
    const {skill} = story;
    if (skill) {
      this.props.navigation.navigate('Task', {skill})
    }
  }

  render() {
    const {taskGroup} = this.state;
    const story = taskGroup._typeObject;
    return (
      <SafeAreaView style={styles.container}>
        <Header title='Chat'
                navigation={this.props.navigation}
                rightText={story.quota ? `${taskGroup._team.emails.length}/${story.quota}` : ''}
                headerStyle={{
                  backgroundColor: '#F8F8F8',
                  elevation: 0,
                }}
                headerIconStyle={{
                  color: '#130C38',
                }}
                headerRightTextStyle={{
                  color: '#1FBEB8'
                }}
        />
        <View style={styles.storyDetailView}>
          <View style={styles.storyDetailHeader}>
            <Text style={styles.storyDetailTitle}>{story.name}</Text>
            <Text style={styles.storyDetailXP}>Team 100 XP</Text>
          </View>
          <Text style={styles.storyDetailText} numberOfLines={2}>{story.description}</Text>
          <View>
            <Text style={styles.storyDetailTagTitle}>You Gain</Text>
            <View style={styles.storyDetailTags}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.storyDetailTag}>50 xp</Text>
                <Text style={styles.storyDetailTag}>5 team xp</Text>
                {story.reward ? (
                  <Text style={styles.storyDetailTag}>
                    {`${story.reward.type} ${story.reward.value || ''}`}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => this.goToTask(story)}>
                <Text style={styles.storyDetailActionTag}>Start Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
