import { connect } from 'react-redux';
import StoryView from '../views/StoryView';
import {isImmutable} from "immutable";

export default connect(
    state => ({
        isReady: state.getIn(['session', 'isReady']),
        user: isImmutable(state.getIn(['user', 'user']))?state.getIn(['user', 'user']).toJS():state.getIn(['user', 'user']),
    })
)(StoryView);
