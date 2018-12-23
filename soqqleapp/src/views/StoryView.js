import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Platform, StatusBar,
    Image, SafeAreaView, Dimensions
} from 'react-native';
import Video from 'react-native-video'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { STORY_IMAGE_BASE_URL, STORY_VIDEO_BASE_URL } from './../constants';
import { STORIES_LIST_API, STORY_HAS_VIDEO_API } from './../endpoints';
import Carousel from 'react-native-snap-carousel';
import CustomText from './../components/CustomText';

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;
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
        width: wp('6%'),
        height: hp('3%'),
    },
    footerTabText: {
        color: '#fff',
        paddingTop: hp('1%'),
        fontSize: wp('3.5%'),
        fontWeight: '700',
    }
});

export default class StoryView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            stories: [],
            currentSlideIndex: 0,
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

    _renderItem = ({ item, index }) => {
        return (
            <View>
                <View style={styles.storyContainer}>
                    {item.has_video && this.state.currentSlideIndex === index ? (
                        <Video
                            ref={(ref) => {
                                this.player = ref
                            }}
                            source={{ uri: STORY_VIDEO_BASE_URL.replace('{}', item._id) }}
                            resizeMode={"cover"}
                            controls={true}
                            volume={1.0}
                            rate={1.0}
                            style={styles.storyItemVideo}
                        />
                    ) : (
                            <Image
                                source={{ uri: STORY_IMAGE_BASE_URL.replace('{}', item._id) }}
                                style={styles.storyItemImage}
                                resizeMode='cover'
                            />
                        )}
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
                            source={require('./../../assets/images/thumbs_up.png')}
                            style={styles.storyActionIcon}
                        />
                    </View>
                    <View style={{ ...styles.storyActionBlock, ...{ 'borderColor': '#171a54' } }}>
                        <Image
                            source={require('./../../assets/images/thubms_down.png')}
                            style={styles.storyActionIcon}
                        />
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Image
                        source={require('./../../assets/images/chat.png')}
                        style={styles.headerIcon}
                    />
                    <Image
                        source={require('./../../assets/images/menu.png')}
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
                            onBeforeSnapToItem={(slideIndex) => this.setState({ currentSlideIndex: slideIndex })}
                        />
                    </View>
                </View>
                <View style={styles.footer}>
                    <View style={styles.footerTab}>
                        <Image
                            source={require('./../../assets/images/dashboard.png')}
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
                            source={require('./../../assets/images/story.png')}
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
                            source={require('./../../assets/images/task.png')}
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