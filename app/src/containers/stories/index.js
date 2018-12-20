import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Platform, StatusBar,
    Image, SafeAreaView, Dimensions, ScrollView
} from 'react-native';
// import { Font, Video } from 'expo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { STORY_IMAGE_BASE_URL, STORY_VIDEO_BASE_URL } from './../../constants';
import { STORIES_LIST_API, STORY_HAS_VIDEO_API } from './../../endpoints';
import Carousel from 'react-native-snap-carousel';
import CustomText from './../../components/CustomText';

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
    storyItemVideo: {
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
        minHeight: 80,
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

let playbackObject = {}

export default class Stories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            stories: [],
        }
    }

    componentWillMount() {
        this.getStories();
    }

    async componentDidMount() {
        // await Font.loadAsync({
        //     'open-sans': require('./../../../fonts/OpenSans-Regular.ttf'),
        // });
        this.setState({ loading: false });
    }

    getStories() {
        return fetch(STORIES_LIST_API)
            .then((response) => response.json())
            .then((responseJson) => {
                this.mapStoriesWithVideo(responseJson);
            })
            .catch((error) => {
                return [];
            });
    }

    mapStoriesWithVideo(stories) {
        const results = stories.map(async story => {
            return fetch(STORY_HAS_VIDEO_API.replace('{}', story._id))
                .then((response) => response.json())
                .then((responseJson) => {
                    return { ...story, ...{ 'has_video': true } }
                })
                .catch((error) => {
                    return { ...story, ...{ 'has_video': false } }
                });
        })
        Promise.all(results).then((completed) => this.setState({ stories: completed }));
    }

    _handleVideoRef = component => {
        playbackObject = component;
        playbackObject.setStatusAsync({ shouldPlay: false, positionMillis: 0 })
    }

    _renderItem = ({ item, index }) => {
        return (
            <View>
                <View style={styles.storyContainer}>
                    {/* {item.has_video ? (
                        <Video
                            source={{ uri: STORY_VIDEO_BASE_URL.replace('{}', item._id) }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            useNativeControls
                            style={styles.storyItemVideo}
                        />
                    ) : (
                            <Image
                                source={{ uri: STORY_IMAGE_BASE_URL.replace('{}', item._id) }}
                                style={styles.storyItemImage}
                                resizeMode='cover'
                            />
                        )} */}
                    {/*<Video*/}
                        {/*source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}*/}
                        {/*rate={1.0}*/}
                        {/*volume={1.0}*/}
                        {/*isMuted={false}*/}
                        {/*resizeMode="cover"*/}
                        {/*useNativeControls*/}
                        {/*style={styles.storyItemVideo}*/}
                        {/*ref={this._handleVideoRef}*/}
                    {/*/>*/}
                    <View style={styles.storyContent}>
                        <CustomText loading={this.state.loading}
                            styles={styles.storyItemText}
                            numberOfLines={3}
                            font='open-sans'>
                            {item.description}
                        </CustomText>
                        <View style={styles.storyTagContainer}>
                            {item._objective ? (
                                <CustomText loading={this.state.loading}
                                    styles={styles.storyTag}
                                    font='open-sans'>
                                    {`${item._objective.value} ${item._objective.name.toUpperCase()}`}
                                </CustomText>
                            ) : null}
                            <CustomText loading={this.state.loading}
                                styles={styles.storyTag}
                                font='open-sans'>
                                {`0/${item.quota || 0} ${item.refresh.toUpperCase()}`}
                            </CustomText>
                            {item.reward ? (
                                <CustomText loading={this.state.loading}
                                    styles={{ ...styles.storyTag, ...{ 'marginRight': 0 } }}
                                    font='open-sans'>
                                    {`${item.reward.value} ${item.reward.type.toUpperCase()}`}
                                </CustomText>
                            ) : null}
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
        );
    }

    handleSnapChange(slideIndex) {
        if (playbackObject) {
            console.log(slideIndex, playbackObject.props);
            playbackObject.setStatusAsync({ shouldPlay: false, positionMillis: 0 })
            // playbackObject.stopAsync();
        }
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
                        <Carousel
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.stories}
                            renderItem={this._renderItem}
                            sliderWidth={width}
                            itemWidth={wp('90%')}
                            onBeforeSnapToItem={(slideIndex) => this.handleSnapChange(slideIndex)}
                        />
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
