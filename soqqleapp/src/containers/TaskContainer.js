import { connect } from 'react-redux';
import {isImmutable} from 'immutable'
import TaskView from '../views/TaskView';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import * as TaskActions from '../reducers/TaskReducer';

export default connect(
  state => ({
    user: isImmutable(state.getIn(['user', 'user']))?state.getIn(['user', 'user']).toJS():state.getIn(['user', 'user']),
    getQuestionsSuccess: state.getIn(['user', 'getQuestionsSuccess']),
    questions: isImmutable(state.getIn(['task', 'questions']))?state.getIn(['task', 'questions']).toJS():state.getIn(['task', 'questions']),
    error: state.getIn(['task', 'error'])
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
      taskActions: bindActionCreators(TaskActions , dispatch)
    };
  }
)(TaskView);
