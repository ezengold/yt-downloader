import React from 'react';
import { View } from 'components';
import { useTheme } from 'providers/theme';

const EmptyContent = () => {
  const { colors, toggleScheme } = useTheme();

  return (
    <View className="ezen-content d-flex flex-column align-items-center justify-content-center">
      <View
        height={40}
        background={colors.principal}
        color="white"
        radius="3px"
        className="px-4 mb-5 d-flex align-items-center justify-content-center cursor-pointer"
        onClick={() => toggleScheme()}
      >
        Toggle
      </View>
      Click an item to view it details
    </View>
  );
};

export default EmptyContent;
