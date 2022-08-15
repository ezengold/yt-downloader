import React from 'react';
import { View } from 'components';
import Aside from './Aside';
import EmptyContent from './EmptyContent';
import { useTheme } from 'providers/theme';

const MainScreen = () => {
  const {colors} = useTheme();

  return (
    <View background={colors.background} className="ezen-container">
      <Aside />
      <EmptyContent />
    </View>
  );
};

export default MainScreen;
