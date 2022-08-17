import React from 'react';
import { FilePathInput, Text, View } from 'components';

const SetLocation = () => {
  return (
    <View className="fadeInAnim d-flex flex-column">
      <Text>Choose default location for downloads</Text>
      <FilePathInput
        className="mt-4"
        width="60%"
        placeholder="Choose a path"
        // path="/Users/ezen/Documents/IOS/COURSE/Intermediates"
      />
    </View>
  );
};

export default SetLocation;
