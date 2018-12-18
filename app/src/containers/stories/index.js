import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Platform, StatusBar,
    Image, SafeAreaView, Dimensions, ScrollView
} from 'react-native';
import { Font } from 'expo';
import CustomText from './../../components/CustomText';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
        backgroundColor: '#10123b',
        flex: 1
    },
    header: {
        height: hp('8%'),
        paddingHorizontal: wp('4%'),
        backgroundColor: '#800094',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width,
    },
    headerIcon: {
        width: wp('8%'),
        height: hp('4%'),
    },
    bodyScrollView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: hp('4%'),
        height: hp('82%'),
    },
    storyContainer: {
        backgroundColor: '#171a54',
        width: wp('90%'),
    },
    storyItemImage: {
        alignSelf: 'center',
        width: '100%',
        height: hp('35%'),
    },
    storyContent: {
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2.5%'),
    },
    storyItemText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: wp('4.6%'),
    },
    storyTagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingTop: hp('2.5%'),
    },
    storyTag: {
        backgroundColor: '#111e4a',
        color: '#ffc500',
        padding: wp('2%'),
        fontSize: wp('3.5%'),
        marginBottom: hp('1%'),
        fontWeight: '700'
    },
    storyActionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: hp('3%'),
    },
    storyActionBlock: {
        borderRadius: 30,
        borderWidth: 1,
        borderStyle: 'solid',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
    },
    storyActionIcon: {
        width: wp('8%'),
        height: hp('4%'),
    },
    footer: {
        backgroundColor: '#800094',
        height: hp('10%'),
        width: width,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    footerTab: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerTabIcon: {
        width: wp('8%'),
        height: hp('4%'),
    },
    footerTabText: {
        color: '#fff',
        paddingTop: hp('1%'),
        fontSize: wp('3.5%'),
        fontWeight: '700',
    }
});

export default class Stories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    async componentWillMount() {
        await Font.loadAsync({
            'open-sans': require('./../../../fonts/OpenSans-Regular.ttf'),
        });
        this.setState({ loading: false });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Image
                        source={require('./../../../images/chat.png')}
                        style={styles.headerIcon}
                    />
                    <Image
                        source={require('./../../../images/menu.png')}
                        style={styles.headerIcon}
                    />
                </View>
                <View showsVerticalScrollIndicator={false} style={styles.bodyScrollView}>
                    <View>
                        <View style={styles.storyContainer}>
                            <Image
                                source={require('./../../../images/story_item_1.png')}
                                style={styles.storyItemImage}
                                resizeMode='cover'
                            />
                            <View style={styles.storyContent}>
                                <CustomText loading={this.state.loading}
                                    styles={styles.storyItemText}
                                    numberOfLines={3}
                                    font='open-sans'>
                                    Cyberattacks are occuring often in the digi-space! Find out what the top 10 ways hackers want your data!
                                </CustomText>
                                <View style={styles.storyTagContainer}>
                                    <CustomText loading={this.state.loading}
                                        styles={styles.storyTag}
                                        font='open-sans'>
                                        10 {'illuminates'.toUpperCase()}
                                    </CustomText>
                                    <CustomText loading={this.state.loading}
                                        styles={styles.storyTag}
                                        font='open-sans'>
                                        1/5 {'weekly'.toUpperCase()}
                                    </CustomText>
                                    <CustomText loading={this.state.loading}
                                        styles={{ ...styles.storyTag, ...{ 'marginRight': 0 } }}
                                        font='open-sans'>
                                        20 {'Tokens'.toUpperCase()}
                                    </CustomText>
                                </View>
                            </View>
                        </View>
                        <View style={styles.storyActionsContainer}>
                            <View style={{ ...styles.storyActionBlock, ...{ 'backgroundColor': '#ffc500' } }}>
                                <Image
                                    source={require('./../../../images/thumbs_up.png')}
                                    style={styles.storyActionIcon}
                                />
                            </View>
                            <View style={{ ...styles.storyActionBlock, ...{ 'borderColor': '#171a54' } }}>
                                <Image
                                    source={require('./../../../images/thubms_down.png')}
                                    style={styles.storyActionIcon}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    <View style={styles.footerTab}>
                        <Image
                            source={require('./../../../images/dashboard.png')}
                            style={styles.footerTabIcon}
                        />
                        <CustomText loading={this.state.loading}
                            styles={{ ...styles.footerTabText, ...{ 'marginRight': 0 } }}
                            font='open-sans'>
                            {'Dashboard'.toUpperCase()}
                        </CustomText>
                    </View>
                    <View style={styles.footerTab}>
                        <Image
                            source={require('./../../../images/story.png')}
                            style={styles.footerTabIcon}
                        />
                        <CustomText loading={this.state.loading}
                            styles={{ ...styles.footerTabText, ...{ 'marginRight': 0 } }}
                            font='open-sans'>
                            {'Story'.toUpperCase()}
                        </CustomText>
                    </View>
                    <View style={styles.footerTab}>
                        <Image
                            source={require('./../../../images/task.png')}
                            style={styles.footerTabIcon}
                        />
                        <CustomText loading={this.state.loading}
                            styles={{ ...styles.footerTabText, ...{ 'marginRight': 0 } }}
                            font='open-sans'>
                            {'Task'.toUpperCase()}
                        </CustomText>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}