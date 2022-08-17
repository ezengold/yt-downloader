import React from 'react';
import { View } from 'components';

const EmptyContent = ({ overlayed }) => {
  return (
    <View
      className={`ezen-content ${
        overlayed ? 'overlayed' : ''
      } d-flex flex-column align-items-center justify-content-center`}
    >
      Click an item to view it details
    </View>
  );
};

export default EmptyContent;
