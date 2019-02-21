import {connect} from 'react-redux';
import {isImmutable} from 'immutable';

import StoryView from './../views/StoryView';
import * as StoryActions from "../reducers/StoryReducer";
import {bindActionCreators} from "redux";

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() :
            state.getIn(['user', 'user']),
        stories: isImmutable(state.getIn(['story', 'stories'])) ? state.getIn(['story', 'stories']).toJS() :
          state.getIn(['story', 'stories']),
    }),
    dispatch => {
      return {
        storyActions: bindActionCreators(StoryActions, dispatch),
      };
    }
)(StoryView);
