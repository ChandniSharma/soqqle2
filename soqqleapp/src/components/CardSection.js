import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {Card} from './Card';

const styles = {
    viewContainer: {
        borderBottomWidth: 0,
        backgroundColor: 'fff',
        padding: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        position: 'relative',
    }
};

const CardSection = props => {
    return (
        <View style={[styles.viewContainer, props.style]}>
            {props.children}
        </View>
    );
};

export default CardSection;
