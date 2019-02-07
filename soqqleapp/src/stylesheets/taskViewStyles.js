import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Dimensions, Platform, StatusBar, StyleSheet} from 'react-native';

import {MAIN_COLOR, PLACEHOLDER_COLOR} from '../constants';

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

export default StyleSheet.create({
    wrapper: {
        paddingTop: statusBarHeight,
        flex: 1,
        padding: 0,
        flexDirection: 'column',
        backgroundColor: '#130C38',
    },
    container: {
        flex: 1,
        padding: 0,
        flexDirection: 'column',
        backgroundColor: '#130C38',
    },
    body: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    question: {
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
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
        justifyContent: 'center'
    },
    helpOption: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0
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
    resultModalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
        marginTop: 5,
    },
    buttonText: {
        color: '#FFC600',
        fontSize: 18
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
        borderWidth: 2,
        color: 'white',
        fontSize: 20,
        padding: 15,
        borderRadius: 4,
    },
    answerBorder: {
        borderColor: MAIN_COLOR,
    },
    placeholderBorder:{
        borderColor: PLACEHOLDER_COLOR,
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
    },
    actionBtn: {
        padding: 15,
        alignItems: 'center'
    },
    actionBtnTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    actionBtnTxtDisabled: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7e828a'
    },
    actionPrevNextBtn: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: wp('100%'),
        justifyContent:'space-between',
        padding: 5
    },
    paginationDots: {
        width: 9,
        height: 9,
        backgroundColor: MAIN_COLOR
    }
});
