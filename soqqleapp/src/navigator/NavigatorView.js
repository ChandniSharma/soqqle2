import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppNavigator from './Navigator';


class NavigatorView extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigatorState: PropTypes.shape({
      index: PropTypes.number.isRequired,
      routes: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        routeName: PropTypes.string.isRequired
      }))
    }).isRequired
  };

  render() {
    return (
      <AppNavigator/>
    );
  }
}

export default NavigatorView;
