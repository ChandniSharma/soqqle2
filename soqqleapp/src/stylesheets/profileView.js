import {StyleSheet} from "react-native";
import {MAIN_COLOR} from "../constants";

export default StyleSheet.create({
    companyButton: {
        backgroundColor: 'white',
        borderColor: MAIN_COLOR,
        borderWidth: 1,
        marginRight: 10,
    },
    topProfile: {
        paddingBottom: 20,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        marginBottom: 12
    },
    headerIcon: {
        fontSize: 25,
        color: 'black'
    },
    headerMenuIcon: {
        fontSize: 15,
        color: 'black'
    },
    blockIcon:{
        width:20,
        height:20,
        marginLeft:15,
        marginRight:10,
    },
    blurBg: {
        backgroundColor: '#F8F8F8'
    },
    card: {
        marginLeft: 12,
        marginRight: 12,
        borderRadius: 10,
    },
    cardImage: {
        height: 200,
        width: null,
        flex: 1,
        borderRadius: 5
    },
    cardBody: {
        margin: 10,
        justifyContent: 'flex-start'
    },
    cardTitle: {
        fontSize: 15
    },
    cardDescription: {
        color: 'rgba(19, 12, 56, 0.5)'
    },
    joinButton: {
        marginTop: 5,
        backgroundColor: MAIN_COLOR
    },
    avatar: {
        width: 60,
        height: 60,
    },
    inputName: {
        fontSize: 20
    },
    input: {
        fontSize: 15,
    },
    profileStats: {
        flexDirection: 'row',
        marginTop: 3,
    },
    profileTokenIcon: {
        color: '#9600A1',
        fontSize: 16,
        paddingRight: 3,
    },
    profileTokenText: {
        color: '#9600A1',
        fontSize: 15,
    }
});
