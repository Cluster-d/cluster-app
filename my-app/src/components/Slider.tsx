import React from 'react';
import Slider from '@react-native-community/slider';

// Correctly wrap the Slider as a class component
class SliderWrapper extends React.Component {
  render() {
    return <Slider {...this.props} />;
  }
}

export default SliderWrapper;
