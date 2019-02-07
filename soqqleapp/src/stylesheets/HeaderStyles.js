import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    header: {
        paddingRight: 15,
        position: 'relative',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#130C38',
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    headerTitle: {
        fontSize: 20,
        textAlign: 'center',
        color: '#ffffff',
    },
    headerBackIcon: {
        color: '#FFFFFF',
        fontSize: 20,
        paddingVertical: 18,
        paddingHorizontal: 20,
    },
    headerRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    headerRightText: {
        color: '#FFFFFF',
        fontSize: 16,
    }
});