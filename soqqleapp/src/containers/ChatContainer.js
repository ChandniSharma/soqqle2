import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isImmutable } from 'immutable';
import * as UserActions from '../reducers/UserReducer';
import ChatView from '../views/ChatView';

export default connect(
    state => ({
        isReady: state.getIn(['session', 'isReady']),
        user: state.getIn(['user', 'user']),
        taskGroups: isImmutable(state.getIn(['user', 'task_groups'])) ? state.getIn(['user', 'task_groups']).toJS() : state.getIn(['user', 'task_groups']),
    }),
    dispatch => {
        return {
            userActions: bindActionCreators(UserActions, dispatch)
        };
    }
)(ChatView);
