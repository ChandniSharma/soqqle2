import { connect } from 'react-redux';
import LevelView from '../views/LevelView';

export default connect(
  state => ({
    isReady: state.getIn(['session', 'isReady']),
    user: state.getIn(['user', 'user'])
  })
)(LevelView);
