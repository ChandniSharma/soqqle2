import {Map, List, fromJS, Seq} from 'immutable';

export const isValidEmail = email => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
};

export function deepFromJS(js) {
    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            Seq(js).map(deepFromJS).toList() :
            Seq(js).map(deepFromJS).toMap();
}

export function getGroupUserDetails(groupDetails) {
    groupDetails.latestUserTaskGroups.map((group, groupIndex) => {
        return group._team.emails.map((email, emailIndex) => {
            return groupDetails.latestUserTaskGroups[groupIndex]._team.emails[emailIndex]['userDetails'] = groupDetails.userDetails.find((element) => {
                return element.profile.email === email.email;
            });
        });
    });
    return groupDetails;
}

export function getMessages(groupDetails, messages,blockUserIds) {
    let messagesWithUserDetails = [];
    messages.map(message => {
        let userData = groupDetails._team.emails.find(user => {
            return user.userDetails._id === message.sender;
        });
        let isUnBlocked = true;
        if (blockUserIds.length>0 && blockUserIds.indexOf(userData.userDetails._id) !== -1) {
            isUnBlocked = false;
        }
        if (userData && userData.userDetails && userData.userDetails.profile && isUnBlocked) {
            if(message.message == 'Task is completed'){
                messagesWithUserDetails.push(
                    {
                        _id: message._id,
                        text: message.message,
                        createdAt: new Date(message.time),
                        system: true,
                    }
                );
            }else{
                messagesWithUserDetails.push(
                    {
                        _id: message._id,
                        text: message.message,
                        createdAt: new Date(message.time),
                        user: {
                            _id: userData.userDetails._id,
                            name: userData.userDetails.profile.firstName+ ' '+ userData.userDetails.profile.firstName,
                            avatar: userData.userDetails.profile.pictureURL || `https://ui-avatars.com/api/?name=${userData.userDetails.profile.firstName}+${userData.userDetails.profile.lastName}`
                        },
                    }
                );
            }
            
        }
    });
    return messagesWithUserDetails;
}