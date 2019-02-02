import { connect } from 'react-redux';
import {isImmutable} from 'immutable';
import LoginView from '../views/LoginView';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import * as UserActions from '../reducers/UserReducer';

export default connect(
    state => ({
        isReady: state.getIn(['session', 'isReady']),
        user: isImmutable(state.getIn(['user', 'user']))?state.getIn(['user', 'user']).toJS():state.getIn(['user', 'user']),
        checkEmailResult: isImmutable(state.getIn(['user', 'checkEmailResult']))?state.getIn(['user', 'checkEmailResult']).toJS():state.getIn(['user', 'checkEmailResult']),
        loginSuccess: state.getIn(['user', 'loginSuccess']),
        checkEmailSuccess: state.getIn(['user', 'checkEmailSuccess']),
        forgotpasswordSuccess: state.getIn(['user', 'forgotpasswordSuccess']),
        error: state.getIn(['user', 'error'])
    }),
    dispatch => {
        return {
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            userActions: bindActionCreators(UserActions, dispatch)
        };
    }
)(LoginView);
