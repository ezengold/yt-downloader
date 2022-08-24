import React from 'react';
import { FilePathInput, Text, View } from 'components';
import { useStore } from 'providers/store';

const SetLocation = () => {
  const { downloadLocation, updateDownloadLocation } = useStore();

  return (
    <View className="fadeInAnim d-flex flex-column">
      <Text>Choose default location for downloads</Text>
      <FilePathInput
        className="mt-4"
        width="60%"
        placeholder="Click to choose a path"
        path={downloadLocation}
        onChange={updateDownloadLocation}
      />
    </View>
  );
};

export default SetLocation;
