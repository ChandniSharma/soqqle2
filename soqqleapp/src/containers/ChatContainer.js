import { connect } from 'react-redux';
import ChatView from '../views/ChatView';

export default connect(
    state => ({
        isReady: state.getIn(['session', 'isReady']),
        user: state.getIn(['user', 'user']),
        taskGroups: state.getIn(['user', 'task_groups']).toJS()
    })
)(ChatView);
