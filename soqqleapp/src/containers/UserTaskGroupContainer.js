import { connect } from 'react-redux';
import UserTaskGroupView from '../views/UserTaskGroupView';

export default connect(
    state => ({
        isReady: state.getIn(['session', 'isReady']),
        user: state.getIn(['user', 'user']),
    })
)(UserTaskGroupView);
