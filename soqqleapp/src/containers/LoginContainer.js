import { connect } from 'react-redux';
import LoginView from '../views/LoginView';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import * as UserActions from '../reducers/UserReducer';

export default connect(
  state => ({
    isReady: state.getIn(['session', 'isReady']),
    user: state.getIn(['user', 'user']),
    loginSuccess: state.getIn(['user', 'loginSuccess']),
    error: state.getIn(['user', 'error'])
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
      userActions: bindActionCreators(UserActions, dispatch)
    };
  }
)(LoginView);
