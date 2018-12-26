import React, { Component } from 'react';
import {
    Button, Platform, StyleSheet, TouchableOpacity, ActivityIndicator,
    Text, View, Dimensions, SafeAreaView, ScrollView, FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

import { USER_TASK_GROUP_LIST_API } from './../endpoints';
import { PAGE_SIZE, STORY_IMAGE_BASE_URL, STORY_VIDEO_BASE_URL } from './../constants';


const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
        backgroundColor: '#2C2649',
        flex: 1,
    },
    header: {
        backgroundColor: '#130C38',
        paddingHorizontal: 5,
        paddingVertical: 15,
        position: 'relative',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    headerText: {
        color: '#ffffff',
        fontSize: 20,
        textAlign: 'center',
    },
    headerBackView: {
        position: 'absolute',
        paddingHorizontal: 10,
        paddingVertical: 10,
        top: '50%',
        marginTop: -5,
        left: 10,
        zIndex: 3
    },
    headerBackIcon: {
        color: '#FFFFFF',
        fontSize: 20,
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
    taskItemExpiryIcon: {

    },
    taskItemXP: {
        color: '#9600A1',
        fontSize: 19,
    },
    listLoader: {
        paddingVertical: 10,
    }
});

let pageNum = 0;
let totalCount = 0;
let pageSize = PAGE_SIZE;

export default class UserTaskGroupView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userTasks: [],
            initialLoading: true,
            loading: false,
            activeSections: [0],
            totalCount: null,
            refreshing: false
        }
    }

    componentWillMount() {
        this.getUserTasks();
    }

    getUserTasks(page = 1, reset = false) {
        let endpoint = USER_TASK_GROUP_LIST_API.replace('{type}', 'Story');
        fetch(endpoint.replace('{page}', page))
            .then((response) => response.json())
            .then((responseJson) => {
                totalCount = responseJson.totalUserTaskGroups;
                pageNum = page;

                let newUserTasks = responseJson.latestUserTaskGroups;

                if (!reset) {
                    newUserTasks = [...this.state.userTasks, ...newUserTasks];
                }

                this.setState({
                    userTasks: newUserTasks,
                    initialLoading: false,
                    loading: false,
                    refreshing: false
                });
            })
            .catch((error) => {
                this.setState({
                    initialLoading: false,
                    loading: false,
                    refreshing: false
                });
            });
    }

    _renderItem = ({ item, index }) => {
        const data = item._typeObject;
        return (
            <View style={{ paddingHorizontal: 10 }}>
                <View style={styles.taskItem}>
                    <View style={styles.taskItemHeader}>
                        <Text style={styles.taskItemName} numberOfLines={2}>{data.name}</Text>
                        <Text style={styles.taskItemSize}>5/5</Text>
                    </View>
                    <Text style={styles.taskItemDescription}>{data.description}</Text>
                    <View style={styles.taskItemFooter}>
                        <Text style={styles.taskItemExpiry}>
                            {`Expire: ${data.expiry}`}
                        </Text>
                        <Text style={styles.taskItemXP}>100 xp</Text>
                    </View>
                </View>
            </View>
        );
    };

    handleBackAction() {
        this.props.navigation.navigate({ routeName: 'Login' })
    }

    handleRefresh() {
        this.setState({ refreshing: true });
        this.getUserTasks(1, true);
    }

    handleScroll() {
        if (pageNum * pageSize < totalCount && !this.state.loading) {
            this.setState({ loading: true });
            this.getUserTasks(pageNum + 1);
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => this.handleBackAction()}
                        style={styles.headerBackView}>

                        <View>
                            <Icon
                                name='chevron-left'
                                style={styles.headerBackIcon}
                            />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Groups</Text>
                </View>
                {this.state.initialLoading ? (
                    <View style={styles.activityLoaderContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                        <View style={{ flex: 1, marginTop: 5 }}>
                            <FlatList
                                data={this.state.userTasks}
                                keyExtractor={(item, index) => item._id}
                                renderItem={this._renderItem}
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.handleRefresh()}
                                onScrollEndDrag={() => this.handleScroll()}
                            />
                        </View>
                    )}
            </SafeAreaView>
        );
    }
}
