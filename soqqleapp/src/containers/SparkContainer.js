import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import { isImmutable } from 'immutable';
import * as actions from '../reducers/SparkReducer';
import SparkView from '../views/SparkView';

export default connect(
  state => ({
    isReady: state.getIn(['session', 'isReady']),
    user: state.getIn(['user', 'user']),
    sparks: isImmutable(state.getIn(['spark', 'details'])) ? state.getIn(['spark', 'details']).toJS() : state.getIn(['spark', 'details']),
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(SparkView);
