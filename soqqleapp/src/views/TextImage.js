import React, {Component} from 'react';
import {Animated,View,Text} from 'react-native';
import styles from '../stylesheets/storyViewStyles';
import {CHALLENGE_IMAGE_BASE_URL, STORY_IMAGE_BASE_URL, STORY_VIDEO_BASE_URL, TASK_GROUP_TYPES} from '../constants';
import ReadMore from 'react-native-read-more-text';




export default class TextImage extends Component {
	constructor(props){
		super(props);
		console.log(props.item);
		this.state = {
			source: props.source,
			storyItemTextStyle: styles.storyItemImage,
			animatedStyle:{height:new Animated.Value(styles.storyItemImage.height)},
			currentSlideIndex: props.currentSlideIndex,
			item: props.item,
			index:props.index
		}

	}
	render(){		
		const item = this.state.item;				
		const imageBaseUrl = item.type === TASK_GROUP_TYPES.CHALLENGE ? CHALLENGE_IMAGE_BASE_URL : STORY_IMAGE_BASE_URL;
		return (
			<View>
		{item.has_video && this.state.currentSlideIndex === this.state.index ? (
            <Video
              ref={ref =>
                this.player = ref}
              source={{uri: STORY_VIDEO_BASE_URL.replace('{}', item._id)}}
              resizeMode={'cover'}
              controls={true}
              volume={1.0}
              rate={1.0}
              style={styles.storyItemVideo}
            />
          ) : (
            <Animated.Image
              source={{uri: imageBaseUrl.replace('{}', item._id)}}
              style={[this.state.storyItemTextStyle,this.state.animatedStyle]}
              resizeMode='cover'
            />
          )}
          {item.type === TASK_GROUP_TYPES.STORY ? (
            <View style={styles.storyContent}>
              <ReadMore
              numberOfLines={2}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}>
             <Text
                style={styles.storyItemText}
              >         
                  {item.description}                
              </Text> 
            </ReadMore>             
              <View style={styles.storyTagContainer}>
                {item._objective && (
                  <Text style={{...styles.storyTag, ...styles.objectiveTag}}>
                    {`${item.objectiveValue || 0} ${item._objective.name.toUpperCase()}`}
                  </Text>
                )}
                <Text style={{...styles.storyTag, ...styles.quotaTag}}>
                  {`0/${item.quota || 0} ${item.refresh.toUpperCase()}`}
                </Text>
                {item.reward && (
                  <Text style={{...styles.storyTag, ...styles.rewardTag}}>
                    {`${item.reward.value || 0} ${item.reward.type.toUpperCase()}`}
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.storyContent}>
              <Text
                style={styles.challengeItemTitle}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                style={styles.challengeItemText}
                numberOfLines={4}
              >
                {item.description}
              </Text>
              <View style={styles.storyTagContainer}>
                {item.type && (
                  <Text style={{...styles.storyTag, ...styles.objectiveTag}}>
                    {item.type.toUpperCase()}
                  </Text>
                )}
                <Text style={{...styles.storyTag, ...styles.quotaTag}}>
                  {`0/${item.quota || 0} ${(item.refresh || '').toUpperCase()}`}
                </Text>
                {item.reward && (
                  <Text style={{...styles.storyTag, ...styles.rewardTag}}>
                    {`${item.rewardValue || 0} ${item.reward.toUpperCase()}`}
                  </Text>
                )}
              </View>
            </View>
          )}
          </View>
        );
	}


	_renderTruncatedFooter = (handlePress) => {        
    return (
      <Text style={styles.showOrLess} onPress={() => {Animated.timing(this.state.animatedStyle.height,{toValue:styles.storyItemImageMin.height,duration:500}).start(); this.setState({storyItemTextStyle:styles.storyItemImage});  handlePress();}}>
        more
      </Text>      
    );
  }

  _renderRevealedFooter = (handlePress) => {    
    return (
      <Text style={styles.showOrLess} onPress={() => { Animated.timing(this.state.animatedStyle.height,{toValue:styles.storyItemImage.height,duration:500}).start(); this.setState({storyItemTextStyle: styles.storyItemImage}); handlePress();}}>
        less
      </Text>      
    );
  }

  	_handleTextReady = () => {
    // ...
  	}

}