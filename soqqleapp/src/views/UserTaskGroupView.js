import React, {Component} from 'react';
import {
    FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableHighlight, TouchableWithoutFeedback, View
} from 'react-native';

import Header from './../components/Header';
import {PAGE_SIZE} from './../constants';
import TaskCard from '../components/TaskCard';

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;

const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
        backgroundColor: '#2C2649',
        flex: 1,
    },
    activityLoaderContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskItem: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        marginVertical: 6,
    },
    taskItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    taskItemName: {
        fontSize: 20,
        letterSpacing: 1,
        color: '#000000',
        width: '90%'
    },
    taskItemSize: {
        color: '#1FBEB8',
        fontSize: 16,
    },
    taskItemDescription: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 14,
    },
    taskItemFooter: {
        marginTop: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskItemExpiry: {
        color: '#2C2649',
        fontSize: 14,
    },
    taskItemExpiryIcon: {},
    taskItemXP: {
        color: '#9600A1',
        fontSize: 19,
    },
    listLoader: {
        paddingVertical: 10,
    },

});

let pageNum = 0;
let totalCount = 0;
let pageSize = PAGE_SIZE;
let userEmail = null;

export default class UserTaskGroupView extends Component {

    _renderItem = ({item}) => {
        const data = item._typeObject;
        const teamLength = item._team.emails.length;
        const taskGroupId = item._id;
        if (!data) return null;
        return <TaskCard {...this.props} task={data} teamLength={teamLength} taskGroupId={taskGroupId}
            team={item._team.emails || []}/>;
    };

    constructor(props) {
        super(props);
        this.state = {
            userTasks: [],
            initialLoading: true,
            loading: false,
            totalCount: null,
            refreshing: false
        };
        userEmail = this.props.user.profile && this.props.user.profile.email || null;
    }

    componentWillMount() {
        const response = this.props.taskGroups;
        const params = this.props.navigation.state.params;
        const isReset = params && params.reset || false;
        if (response.taskGroups && Object.keys(response.taskGroups).length && !isReset) {
            pageNum = response.page;
            totalCount = response.count;
            this.setState({userTasks: response.taskGroups});
        }
        else {
            if (userEmail) {
                this.props.userActions.getUserTaskGroupsRequest({
                    page: 1, load: true, user_email: userEmail
                });
            }
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userTaskGroupsSuccess != this.props.userTaskGroupsSuccess) {
            let response = nextProps.taskGroups;
            if (Object.keys(response).length && nextProps.userTaskGroupsSuccess) {
                totalCount = response.count;
                pageNum = response.page;
                this.setState({
                    userTasks: response.taskGroups,
                    loading: false,
                    refreshing: false
                });
            }
            if (!nextProps.userTaskGroupsSuccess && nextProps.error && Object.keys(nextProps.error).length) {
                this.setState({
                    loading: false,
                    refreshing: false
                });
            }
        }
    }

    handleBackAction() {
        this.props.navigation.navigate({routeName: 'Story'});
    }

    handleRefresh() {
        if (userEmail) {
            this.setState({refreshing: true});
            this.props.userActions.getUserTaskGroupsRequest({page: 1, user_email: userEmail});
        }
    }

    handleScroll() {
        if (pageNum * pageSize < totalCount && !this.state.loading && userEmail) {
            this.setState({loading: true});
            this.props.userActions.getUserTaskGroupsRequest({
                page: pageNum + 1,
                previousData: this.state.userTasks,
                user_email: userEmail
            });
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header title='Groups' navigation={this.props.navigation}/>
                <View style={{flex: 1, marginTop: 5}}>
                    <FlatList
                        data={this.state.userTasks}
                        keyExtractor={item => item._id}
                        renderItem={this._renderItem}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.handleRefresh()}
                        onScrollEndDrag={() => this.handleScroll()}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
