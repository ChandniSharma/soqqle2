import React, { Component } from 'react';
import * as axios from 'axios';
import {
    Dimensions,
    Image, Modal,
    KeyboardAvoidingView,
    Platform, ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View, TextInput,
    ActivityIndicator
} from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import _ from 'lodash';
import SocketIOClient from 'socket.io-client';
import { MAIN_COLOR, QUESTION_IMAGE_BASE_URL, PLACEHOLDER_COLOR,  } from '../constants';
import { API_BASE_URL } from '../config';
import { SAVE_ANSWERS_PATH_API, USER_SPARK_LIST_PATH_API,CHAT_SOCKET_URL } from '../endpoints';
import Header from '../components/Header';
import styles from '../stylesheets/taskViewStyles';

const { width } = Dimensions.get('window'); //full width

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: { 'Content-type': 'application/json' }
});

// TODO: Update this class to new Lifecycle methods
export default class TaskView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            currentSlideIndex: 0,
            modalVisible: false,
            helps: [],
            resultModalVisible: false,
            processing: false,
            achievementCompletionDetail: {},
        };
    }

    static flashMessage = message => {
        showMessage({ message, type: MAIN_COLOR });
    };

    componentDidMount() {
        let user = this.props.user;
        let query = `userID=${user._id}&username=${user._id}&firstName=${user.profile.firstName ? user.profile.firstName : ''}&lastName=${user.profile.lastName ? user.profile.lastName : ''}&userType=test`;
        this.socket = SocketIOClient(CHAT_SOCKET_URL, { query: query, transports: ['websocket'] });

        const skill = this.props.navigation.getParam('skill', null);
        if (skill) {
            this.props.taskActions.getQuestions(skill);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.questions && !_.isEqual(nextProps.questions, this.state.questions) && _.size(nextProps.questions)) {
            this.setState({ questions: nextProps.questions, helps: nextProps.questions[0].preLoad || [] });
        }
    }

    onChange = (index, field, value) => {
        const { questions } = this.state;
        this.setState({
            modalVisible: false,
            questions: questions.map((question, i) => index === i ? { ...question, [field]: value } : question)
        });
    };

    onSave = () => {
        const { questions } = this.state;
        let isCompleted = true;
        for (let i = 0; i < questions.length; i++) {
            if (_.isEmpty(questions[i].answer)) {
                TaskView.flashMessage('Please complete all questions!');
                this.setState({ currentSlideIndex: i });
                this._carousel.snapToItem(i, true);
                isCompleted = false;
                break;
            }
        }
        if (isCompleted && !this.state.processing) {
            this.saveUserQuestions(questions);
        }
    };

    saveUserQuestions(questions) {
        let task = this.props.navigation.getParam('task', null);
        const reward = this.props.navigation.getParam('reward', {});
        if (!task) {
            return;
        }

        this.setState({
            processing: true,
        });
        const data = {
            taskId: task._id,
            userId: this.props.user._id,
            tokenCount: reward.value || 0,
            answers: questions.reduce((obj, item) => {
                obj[item._id] = { text: item.answer, timeChanged: Date.now() };
                return obj;
            }, {})
        };
        instance.post(SAVE_ANSWERS_PATH_API, data).then(response => {
            this.updateTaskStatus(response.data.foundTask);
            this.refreshSparks();
            this.setState({
                resultModalVisible: true,
                processing: false,
                achievementCompletionDetail: this.getAchievementDetails(response.data)
            });
            const taskGroups = this.props.taskGroups.taskGroups;
            const id = this.props.navigation.state.params.task_group_id;
            const team_id = this.props.navigation.state.params.team_id;
            this.socket.emit('client:message', {
                sender: this.props.user._id,
                receiver: team_id,
                chatType: 'GROUP_MESSAGE',
                message: 'Task is completed'
              });
        }).catch(error => console.error(error));
    }

    
    getAchievementDetails(responseData, achievementIndex = 0) {
        let data = {};
        const { updatedAchievements, userAchievementResult, result } = responseData;

        if (updatedAchievements && updatedAchievements.length) {
            let updates = updatedAchievements[achievementIndex]; // for now take only 1
            let achievementsInfo = userAchievementResult.achievements.filter(
                info => info.achievementId === updates._id,
            )[0] || {};
            let achievementDescription = result.filter(
                info => info._id === updates._id,
            )[0] || {};
            updates = { ...updates, conditions: achievementsInfo.conditions || [] };

            data = {
                ...updates,
                countProgress: updates.conditions[0].counter,
                countComplete: updates.conditions[0].count,
                displayName: updates.name,
                id: updates._id,
                displayProgressVsComplete: `${this.getProgress(updates)}`,
                generic: false,
                description: achievementDescription.description
            };
        }
        return data;
    }

    getProgress(updates) {
        const conditionCounter = updates.conditions[0].counter;
        const conditionCount = updates.conditions[0].count;

        if (conditionCounter === conditionCount) {
            return `${updates.conditions[0].taskType} Complete!`;
        }

        const mathFloor = ~~((conditionCounter / conditionCount) * 100);
        return `${conditionCounter}/${conditionCount} ${updates.conditions[0].taskType} - ${mathFloor}% Complete!`;
    }

    updateTaskStatus(task) {
        const taskGroups = this.props.taskGroups.taskGroups;
        const id = this.props.navigation.state.params.task_group_id;
        const index = id && taskGroups.findIndex(t => t._id === id);
        if (index > -1) {
            let taskIndex = taskGroups[index]['_tasks'].findIndex(t => t._id === task._id);
            if (taskIndex > -1) {
                taskGroups[index]['_tasks'][taskIndex] = task;
            }
        }
        this.props.userActions.getUserTaskGroupsCompleted({ ...this.props.taskGroups, taskGroups });
    }

    refreshSparks() {
        const endpoint = USER_SPARK_LIST_PATH_API.replace('{}', this.props.user._id);
        this.props.sparkActions.getSparksRequest({ endpoint });
    }

    onShowResult = () => {
      
        this.setState({ resultModalVisible: false });
        this.props.navigation.navigate('Chat', { taskUpdated: true });
        
    };

    goToPreviousQuestion = () => {
        if (!this._carousel) {
            return;
        }

        this._carousel.snapToPrev(true);
    };

    goToNextQuestion = () => {
        if (!this._carousel) {
            return;
        }

        this._carousel.snapToNext(true);
    };

    renderIlluminate = ({ item, index }) => {
        const { helps, questions = [] } = this.state;
        return <KeyboardAvoidingView style={styles.questionCard} enabled={true} behavior="padding">
            <Text style={styles.questionText}>{item.question}</Text>
            {!item.noImage && <Image resizeMode="cover" style={styles.image}
                source={{ uri: `${QUESTION_IMAGE_BASE_URL}${item._id}_cover` }}
                onError={() => this.onChange(index, 'noImage', true)}

            />}
            <Pagination
                dotsLength={questions.length}
                activeDotIndex={index}
                inactiveDotOpacity={0.6}
                carouselRef={this._carousel}
                tappableDots={true}
                inactiveDotScale={0.6}
                dotStyle={styles.paginationDots} />
            <TextInput multiline={true} placeholderTextColor={PLACEHOLDER_COLOR}
                onChangeText={value => this.onChange(index, 'answer', value)}
                placeholder="Enter answer"
                style={[styles.textArea, questions[index]['answer'] ? styles.answerBorder : styles.placeholderBorder]}
                value={item.answer || ''} />
            {helps.length > 0 && <View style={styles.helpOption}>
                <Button style={styles.stepButton} onPress={() => this.setState({ modalVisible: true })}>
                    <Text style={styles.buttonText}>Get Help</Text>
                </Button>
            </View>}
        </KeyboardAvoidingView>;
    };

    renderHelpItem = (item, index, questionIndex) => {
        return <View key={index}>
            <TouchableOpacity
                onPress={() => this.onChange(questionIndex, 'answer', item.content)}
            >
                <View style={styles.helpItem}>
                    <Text style={styles.helpText}>{item.content}</Text>
                </View>
            </TouchableOpacity>
        </View>;
    };

    toggleModalVisibility() {
        const { modalVisible } = this.state;
        this.setState({ modalVisible: !modalVisible });
    }

    render() {
        const { questions = [], currentSlideIndex, modalVisible, helps, resultModalVisible, processing = false } = this.state;
        const reward = this.props.navigation.getParam('reward', null);
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled={Platform.OS === 'ios'}>
                <SafeAreaView style={styles.container}>
                    <Header title='Task'
                        navigation={this.props.navigation}
                        headerStyle={{
                            elevation: 0,
                        }}
                        headerIconStyle={{
                            color: '#F8F8F8',
                        }}

                    />
                    <View style={styles.body}>
                        <Carousel
                            ref={c => this._carousel = c}
                            data={questions}
                            renderItem={this.renderIlluminate}
                            sliderWidth={width}
                            itemHeight={hp('70%')}
                            itemWidth={wp('90%')}
                            onBeforeSnapToItem={slideIndex => this.setState({
                                currentSlideIndex: slideIndex,
                                helps: questions[slideIndex].preLoad || []
                            })}
                        />
                    </View>
                    <View style={styles.actionPrevNextBtn}>
                        <TouchableOpacity
                            style={styles.actionBtn}
                            disabled={currentSlideIndex === 0}
                            onPress={this.goToPreviousQuestion}>
                            <Text style={currentSlideIndex ? styles.actionBtnTxt : styles.actionBtnTxtDisabled}>Back</Text>
                        </TouchableOpacity>
                        {processing && <ActivityIndicator size={Platform.OS === 'ios' ? 'small' : 18}
                            style={{ paddingHorizontal: 14 }} color="#ffffff" />}
                        {!processing && <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={questions.length === currentSlideIndex + 1 ? this.onSave : this.goToNextQuestion}>
                            <Text style={styles.actionBtnTxt}>
                                {questions.length === currentSlideIndex + 1 ? 'Save' : 'Next'}
                            </Text>
                        </TouchableOpacity>}
                    </View>
                    <Modal
                        animationType="fade"
                        transparent
                        visible={resultModalVisible}
                    >
                        <View style={styles.helpModal}>
                            <View style={styles.resultModalContent}>
                                <Text style={[styles.buttonText, { fontSize: 18 }]}>{this.state.achievementCompletionDetail.displayProgressVsComplete}</Text>
                                <Text style={[styles.buttonText, { fontSize: 25 }]}>You gain {reward.value || 0} {reward.type || ''}</Text>
                                <Button style={styles.stepButton} onPress={this.onShowResult} medium rounded>
                                    <Text style={[styles.buttonText, { fontSize: 25 }]}>OK</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="fade"
                        transparent
                        visible={modalVisible}
                        onRequestClose={this.toggleModalVisibility.bind(this)}
                    >
                        <View style={styles.helpModal}>
                            <View style={styles.helpModalContent}>
                                <ScrollView>
                                    {
                                        helps.map((item, index) => this.renderHelpItem(item, index, currentSlideIndex))
                                    }
                                </ScrollView>
                                <View>
                                </View>
                                <TouchableOpacity
                                    onPress={this.toggleModalVisibility.bind(this)}
                                    style={styles.likeModalClose}
                                >
                                    <View>
                                        <Icon name='close' style={styles.likeModalCloseIcon} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}

