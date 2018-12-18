import React from 'react';
import { Text } from 'react-native';

export default CustomText = (props) => {
    return (
        <Text style={props.loading ? props.styles : { ...props.styles, ...{ 'fontFamily': props.font } }}
            {...props.numberOfLines ? { numberOfLines: props.numberOfLines } : {}} >
            {props.children}
        </Text>
    )
}