import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FacePile from 'react-native-face-pile';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {Body, CardItem, Icon, Left, Thumbnail} from 'native-base';

import styles from './../stylesheets/TaskCardStyles';
import moment from "moment";

export default class TaskCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetails: false
        };
    }

    getListUser = users => users.map(user => {
        let firstName = user.userDetails.profile.firstName || '';
        let lastName = user.userDetails.profile.lastName || '';
        let profilePicture = user.userDetails.profile.pictureURL || `https://ui-avatars.com/api/?name=${firstName || lastName}`;
        let title = user.userDetails.profile.education || '';
        let _id = user.userDetails._id;
        return {firstName, lastName, profilePicture, title, _id};
    });

    getFacePile = users => users.map(user => ({id: user._id, imageUrl: user.profilePicture}));

    render() {
        const {task, taskGroupId, teamLength, team, updatedDateTime, createdDateTime} = this.props;
        const users = this.getListUser(team);
        const facePile = this.getFacePile(users);
        const {isShowDetails} = this.state;
        const createdDateAt = moment(createdDateTime, "YYYYMMDD").fromNow();
        return <View style={{paddingHorizontal: 10}}>
            <SwiperFlatList renderAll>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Chat',
                        {
                            task_group_id: taskGroupId,
                            taskUpdated: false
                        }
                    )}
                >
                    <View style={[styles.swipeItem, styles.taskItem]}>
                        <View style={styles.taskItemHeader}>
                            <Text style={styles.taskItemName} numberOfLines={2}>
                                {task.name} 
                                <Text style={styles.taskItemTime}> {createdDateAt}</Text>
                            </Text>
                            <Text style={styles.taskItemSize}>{task.quota ? `${teamLength}/${task.quota}` : ''}</Text>
                        </View>
                        <Text style={styles.taskItemDescription}>{task.description}</Text>
                        <View style={styles.taskItemFooter}>
                            <Text style={styles.taskItemExpiry}>
                                {`Expire: ${task.expiry || ''}`}
                            </Text>
                            <Text style={styles.taskItemXP}>100 xp</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={[styles.swipeItem, styles.memberWrapper]}>
                    <TouchableOpacity onPress={() => this.setState({isShowDetails: !isShowDetails})}>
                        <View style={styles.topWrapper}>
                            <Text style={styles.textWhite}>{team.length} Members</Text>
                            <Icon onPress={() => this.props.navigation.navigate('Chat',
                                {
                                    task_group_id: taskGroupId,
                                    taskUpdated: false
                                }
                            )} style={styles.textWhite} name="sign-in" type="FontAwesome"/>
                        </View>
                        <FacePile
                            imageStyle={{borderWidth: 0}}
                            containerStyle={[styles.facePile, isShowDetails ? {borderBottomWidth: 1} : null]}
                            numFaces={3} faces={facePile} hideOverflow overlap={0.2}/>
                    </TouchableOpacity>
                    {isShowDetails && <CardItem style={styles.memberWrapper}>
                        {
                            users.map(user => (
                                <Left transparent key={user._id} style={{marginBottom: 10}}>
                                    <Thumbnail small source={{uri: user.profilePicture}}/>
                                    <Body><Text style={[styles.textWhite, {
                                        fontSize: 17,
                                        fontWeight: '500'
                                    }]}>{user.firstName} {user.lastName}</Text>
                                    <Text note style={{color: '#ffffff', opacity: 0.7}}>{user.education}</Text>
                                    </Body>
                                </Left>))
                        }
                    </CardItem>}
                </View>
            </SwiperFlatList>
        </View>;
    }
}

