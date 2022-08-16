import React from 'react';
import { View } from 'components';
import { useApp } from 'providers/app';
import { useTheme } from 'providers/theme';
import Aside from './Aside';
import EmptyContent from './EmptyContent';
import ContentFolder from './ContentFolder';

const MainScreen = () => {
  const { colors } = useTheme();

  const { currentItem } = useApp();

  return (
    <View background={colors.background} className="ezen-container">
      <Aside />
      {!!currentItem && !!currentItem?.id ? (
        <ContentFolder />
      ) : (
        <EmptyContent />
      )}
    </View>
  );
};

export default MainScreen;
