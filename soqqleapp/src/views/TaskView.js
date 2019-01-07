import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground, Modal,
  Platform, ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {Button, Icon, Text, Textarea} from 'native-base';
import {showMessage} from 'react-native-flash-message';
import {MAIN_COLOR} from "../constants";
import {SafeAreaView} from "react-navigation";
import Header from "../components/Header";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import Carousel from "react-native-snap-carousel";
import _ from 'lodash';
const QUESTION_IMAGE_BASE_URL = 'https://s3.us-east-2.amazonaws.com/admin.soqqle.com/questionImages/'

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;
const  {width} = Dimensions.get('window'); //full width


export default class TaskView extends Component {

  constructor(props) {
    super(props);
    this.state = {questions: [], currentSlideIndex: 0, modalVisible: false, helps: []};
  }

  static flashMessage = message => {
    showMessage({message, type: MAIN_COLOR});
  };

  componentDidMount() {
    const skill = this.props.navigation.getParam('skill', null);
    if (skill) {
      this.props.taskActions.getQuestions(skill)
    }
  }

  componentWillUnmount() {
    this.setState({questions: []})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.questions && !_.isEqual(nextProps.questions, this.state.questions)) {
      this.setState({questions: nextProps.questions})
    }
  }

  onChange = (index, field, value) => {
    const {questions} = this.state;
    this.setState({modalVisible: false, questions: questions.map((question, i) => index === i ? {...question, [field]: value}:question)})
  }

  onSave = () => {
    const {questions} = this.state;
    let isCompleted = true;
    for (let i = 0; i < questions.length; i++) {
      if (_.isEmpty(questions[i].answer)) {
        TaskView.flashMessage('Please complete all questions!');
        this.setState({currentSlideIndex: i})
        isCompleted = false;
        break;
      }
    }
  }

  renderIlluminate = ({item, index}) => {
    const {helps} = this.state;
    return <View style={styles.questionCard}>
      <View style={styles.question}>
      <Text style={styles.questionText}>{item.question}</Text>
      {!item.noImage && <Image resizeMode="cover" style={styles.image}
             source={{uri: `${QUESTION_IMAGE_BASE_URL}${item._id}_cover`}}
             onError={() => this.onChange(index, 'noImage', true)}

      />}
      </View>
      <View style={styles.answers}>
        <Textarea placeholderTextColor={MAIN_COLOR} onChangeText={value => this.onChange(index, 'answer', value)} placeholder="Type your answer here!" style={styles.textArea} value={item.answer || ''}/>

        {helps.length > 0 && <Button style={styles.stepButton} onPress={() => this.setState({modalVisible: true})} small rounded>
          <Text style={styles.buttonText}>Get Help</Text>
        </Button>}
      </View>
    </View>;
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
    </View>
  }

  render() {
    const {questions, currentSlideIndex, modalVisible, helps} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => this.setState({modalVisible: !modalVisible})}
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
                onPress={() => {
                  this.setState({modalVisible: !modalVisible})
                }}
                style={styles.likeModalClose}
              >
                <View>
                  <Icon name='close' style={styles.likeModalCloseIcon} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
          <Button style={styles.stepButton} onPress={() => {
          }} small rounded>
            <Text style={styles.buttonText}>{currentSlideIndex + 1}/{questions.length}</Text>
          </Button>
          <Carousel
            ref={(c) => {
              this._carousel = c;
            }}
            data={questions}
            renderItem={this.renderIlluminate}
            sliderWidth={width}
            itemWidth={wp('90%')}
            onBeforeSnapToItem={(slideIndex) => this.setState({currentSlideIndex: slideIndex, helps: questions[slideIndex].preLoad || []})}
          />
          <ImageBackground style={{width: '100%', height: 57}} source={require('../images/RectangleBlue.png')}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.onSave}
            >
              <Text style={styles.submitText}>SAVE</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    paddingTop: statusBarHeight,
    flexDirection: 'column',
    backgroundColor: '#130C38',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    paddingTop: 5,
    paddingHorizontal: 15,
  },
  question: {
    justifyContent: 'center',
    flexDirection: 'column',
    flex:1,
  },
  questionText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontSize: 24
  },
  questionCard: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  answers: {
    width: wp('90%'),
    marginBottom: 10,
  },
  answer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  margin20: {
    marginRight: 20,
  },
  answerText: {
    color: 'white',
    borderColor: 'white',
  },
  answerTextChecked: {
    color: '#FFC600',
  },
  answerCheck: {
    backgroundColor: '#FFC600',
    borderColor: '#FFC600',
  },
  image: {
    width: wp('90%'),
    height: 200,
    marginTop: 10,
  },
  helpModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  helpModalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 25,
    paddingHorizontal: 10,
    width: '90%',
    height: '90%',
    borderRadius: 5,
  },
  stepButton: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderColor: '#FFC600',
    borderWidth: 1,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFC600',
  },
  submitButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  textArea: {
    height: 200,
    borderWidth: 1,
    borderColor: MAIN_COLOR,
    color: 'white',
    fontSize: 20,
    borderRadius: 4,
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
  },
  helpItem: {
    backgroundColor: '#2C2649',
    padding: 10,
    borderRadius: 5,
    marginVertical: 6,
  },
  helpText: {
    fontSize: 15,
    letterSpacing: 1,
    color: '#ffffff',
  }
});
