import { connect } from 'react-redux';
import LoginView from '../views/LoginView';

export default connect(
  state => ({
    isReady: state.getIn(['session', 'isReady'])
  })
)(LoginView);
