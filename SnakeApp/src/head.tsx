import React from 'react';
import {View} from 'react-native';

export default class Head extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const x = this.props.position[0];
    const y = this.props.position[1];

    return (
      <View
        style={{
          width: this.props.size,
          height: this.props.size,
          backgroundColor: '#660000',
          position: 'absolute',
          left: x * this.props.size,
          top: y * this.props.size,
          borderRadius: 10,
        }}
      />
    );
  }
}
