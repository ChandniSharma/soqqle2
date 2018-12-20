import {connect} from 'react-redux';
import {createAppContainer} from 'react-navigation';
import AppNavigator from '../views/Navigator';

export default createAppContainer(AppNavigator);
