import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text, View, SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import CardSection from '../components/CardSection';
import {
    Thumbnail
} from "native-base";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import styles from './../stylesheets/userDetailViewStyles';
import ProfileView from './ProfileView';
import * as UserActions from '../reducers/UserReducer';

class UserDetailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataUser: {},
        };
    }
    componentDidMount() {
        let dictUserDetail = this.props.navigation.state.params.detailDict;
        this.setState({ dataUser: dictUserDetail });
    }
    handleBackAction() {
        this.props.navigation.navigate({ routeName: 'UsersList' })
    }
    render() {
        var name = '', designation = '', imgUser, bio = '';
        let dictUserDetail = this.state.dataUser.userDetails;
        if (dictUserDetail) {
            if (dictUserDetail.profile.firstName) {
                name = dictUserDetail.profile.firstName
            }
            if (dictUserDetail.profile.lastName) {
                name = name + ' ' + dictUserDetail.profile.lastName;
            }
            imgUser = <Thumbnail
                style={styles.imageUser}
                source={{ uri: dictUserDetail.profile.pictureURL || `https://ui-avatars.com/api/?name=${dictUserDetail.profile.firstName}+${dictUserDetail.profile.lastName}` }} />

            if (dictUserDetail.profile.title) {
                designation = dictUserDetail.profile.title;
            }
            if (dictUserDetail.profile.bio) {
                bio = dictUserDetail.profile.bio
            }
        }
        let sparks = {
            tokensCount: 0
        }
        if (dictUserDetail) {
            return (
                <ProfileView
                 taskGroupData={this.props.navigation.state.params.taskGroupData} 
                 backToUserList={true}
                 userActions={this.props.userActions} 
                 sparks={sparks} 
                 user={dictUserDetail}
                 navigation={this.props.navigation}
                 />
            )
        } else {

            return null;
        }

    }
}

export default connect(
    state => ({
        isLoading: state.getIn(['app', 'loading']),
    }),
    dispatch => {
        return {
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            userActions: bindActionCreators(UserActions, dispatch),
        };
    }
)(UserDetailView);