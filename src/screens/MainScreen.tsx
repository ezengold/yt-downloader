import React from 'react';
import { View } from 'components';
import { useApp } from 'providers/app';
import { useTheme } from 'providers/theme';
import Aside from './Aside';
import EmptyContent from './EmptyContent';
import ContentFolder from './ContentFolder';

const MainScreen = () => {
  const { colors } = useTheme();

  const { currentItem, modalShown, ModalComponent } = useApp();

  console.log(ModalComponent);

  return (
    <View background={colors.background} className="ezen-container">
      <Aside renderBlur={modalShown} />
      {!!currentItem && !!currentItem?.id ? (
        <ContentFolder />
      ) : (
        <EmptyContent />
      )}
      {modalShown && (
        <View className="ezen-modal-wrapper" background={`${colors.text}66`}>
          <ModalComponent />
        </View>
      )}
    </View>
  );
};

export default MainScreen;
