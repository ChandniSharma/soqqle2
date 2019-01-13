import React, { Component } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import * as axios from 'axios';
import { API_BASE_URL } from './../config';
import { SAVE_TASK_PATH_API, UPDATE_USER_TASK_GROUP_API_PATH, GET_OBJECTIVE_API_PATH } from './../endpoints';
import Header from './../components/Header';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});


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
    shadowOffset: { width: 0, height: 1 },
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
      taskGroup: {},
      userTask: {},
      processing: false,
    };
  }

  componentWillMount() {
    this.setTaskAndTaskGroup();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.taskUpdated) {
      this.setTaskAndTaskGroup();
    }
  }

  setTaskAndTaskGroup() {
    let id = this.props.navigation.state.params.task_group_id;
    let userTask = {};
    let taskGroup = id && this.props.taskGroups.taskGroups.filter(t => {
      return t._id === id;
    })[0] || {};
    if (Object.keys(taskGroup).length && taskGroup._tasks.length) {
      userTask = taskGroup._tasks.filter(task => {
        return task.userID == this.props.user._id &&
          task.metaData.subject.skill._id == taskGroup._typeObject._id
      })[0];
    }
    this.setState({ taskGroup, userTask });
  }

  goToTask = (story) => {
    if (this.state.processing || this.state.userTask.status === 'complete') return;
    let taskGroupId = this.props.navigation.state.params.task_group_id;
    const { skill, reward } = story;
    if (skill) {
      if (Object.keys(this.state.userTask).length) {
        this.props.navigation.navigate('Task', {
          skill, reward,
          task: this.state.userTask, task_group_id: taskGroupId
        })
      }
      else {
        this.setState({ processing: true });
        instance.get(GET_OBJECTIVE_API_PATH.replace('{}', story._objective)).then(response => {
          let objectiveType = response.data && response.data.name.toLocaleLowerCase()
          if (objectiveType) {
            this.createTask(story, objectiveType, taskGroupId);
          }
        }).catch(err => {
          return {};
        })
      }
    }
  }

  createTask(data, objectiveType, taskGroupId) {
    const userId = this.props.user._id;
    const profile = this.props.user.profile || null;

    const taskData = {
      type: objectiveType,
      userName: `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ''}`,
      userID: userId,
      isHidden: 0,
      creator: {
        _id: userId,
        firstName: profile.firstName,
        ...(profile.lastName ? { lastName: profile.lastName } : {})
      },
      metaData: {
        subject: {
          roadmap: { name: '', },
          skill: { _id: data._id, name: data.skill, },
        },
        participants: [
          {
            user: {
              _id: userId,
              firstName: profile.firstName,
              ...(profile.lastName ? { lastName: profile.lastName } : {})
            },
            status: 'accepted',
            isCreator: true,
          },
        ],
        ratings: [],
        time: Date.now(),
        awardXP: null
      },
    };

    instance.post(SAVE_TASK_PATH_API, taskData).then(response => {
      this.setState({ userTask: response.data });
      this.updateUserTasks(response.data);
      this.updateUserTaskGroup(response.data, taskGroupId);
    }).catch(err => {
      console.log(err.response)
    })

  };

  updateUserTaskGroup(task, taskGroupId) {
    const { taskGroup } = this.state;
    const story = taskGroup._typeObject;
    const { skill, reward } = story;
    let tasks = (taskGroup._tasks || []);
    tasks.push(task);
    let path = UPDATE_USER_TASK_GROUP_API_PATH.replace('{}', taskGroup._id);
    instance.put(path, { '_tasks': tasks }).then(response => {
      this.setState({ processing: false });
      this.props.navigation.navigate('Task', {
        skill, reward,
        task: this.state.userTask, task_group_id: taskGroupId
      });
    }).catch(err => {
      console.log(err.response)
    })
  }

  updateUserTasks(task) {
    const taskGroups = this.props.taskGroups.taskGroups;
    const id = this.props.navigation.state.params.task_group_id;
    let index = id && taskGroups.findIndex(t => {
      return t._id === id;
    });
    if (index > -1) {
      let oldTasks = taskGroups[index]['_tasks'] || [];
      oldTasks.push(task);
      taskGroups[index]['_tasks'] = oldTasks;
    };
    this.props.userActions.getUserTaskGroupsCompleted({ ...this.props.taskGroups, taskGroups });
  }

  render() {
    const { taskGroup } = this.state;
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
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.storyDetailTag}>50 xp</Text>
                <Text style={styles.storyDetailTag}>5 team xp</Text>
                {story.reward ? (
                  <Text style={styles.storyDetailTag}>
                    {`${story.reward.type} ${story.reward.value || ''}`}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => this.goToTask(story)}>
                <View style={styles.storyDetailActionTag}>
                  {this.state.processing ? (
                    <ActivityIndicator size={18} style={{ paddingHorizontal: 14 }} color="#ffffff" />
                  ) : (
                      <Text style={{ color: '#ffffff' }}>
                        {Object.keys(this.state.userTask).length ? (
                          this.state.userTask.status === 'complete' ? 'Task Completed' : 'Task Started'
                        ) : 'Start Task'}
                      </Text>
                    )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
