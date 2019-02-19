import React from 'react';
import {Text, View, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './../stylesheets/HeaderStyles';

export default Header = props => {
    return (
        <View style={{...styles.header, ...props.headerStyle}}>
            <TouchableOpacity onPress={() => {DeviceEventEmitter.emit('REFRESH_STORIES',  {}) ; props.navigation.pop()}} style={styles.headerLeft}>
                <Icon
                    name='chevron-left'
                    style={{...styles.headerBackIcon, ...props.headerIconStyle}}
                />
            </TouchableOpacity>
            <Text style={{...styles.headerTitle, ...props.headerTitleStyle}}>{props.title}</Text>
            <TouchableOpacity
                disabled={!props.rightText}
                style={styles.headerRight}
                activeOpacity={0.8}
                onPress={props.onRight}
            >
                <Text style={{...styles.headerRightText, ...props.headerRightTextStyle}}>{props.rightText}</Text>
            </TouchableOpacity>
        </View>
    );
};
