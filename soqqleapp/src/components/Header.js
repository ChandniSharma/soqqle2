import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './../stylesheets/HeaderStyles';

export default Header = props => {
    return (
        <View style={{...styles.header, ...props.headerStyle}}>
            <TouchableOpacity onPress={() => props.navigation.pop()} style={styles.headerLeft}>
                <Icon
                    name='chevron-left'
                    style={{...styles.headerBackIcon, ...props.headerIconStyle}}
                />
            </TouchableOpacity>
            <Text style={{...styles.headerTitle, ...props.headerTitleStyle}}>{props.title}</Text>
            <View style={styles.headerRight}>
                <Text style={{...styles.headerRightText, ...props.headerRightTextStyle}}>{props.rightText}</Text>
            </View>
        </View>
    );
};
