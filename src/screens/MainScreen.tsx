import React from 'react';
import { View, ConfirmDelete, SettingsModal } from 'components';
import { useApp } from 'providers/app';
import { useTheme } from 'providers/theme';
import { MODALS } from 'configs';
import Aside from './Aside';
import EmptyContent from './EmptyContent';
import ContentFolder from './ContentFolder';

// register modals
const AppModals = {
  [MODALS.CONFIRM_DELETE]: ConfirmDelete,
  [MODALS.SETTINGS]: SettingsModal,
};

const MainScreen = () => {
  const { colors } = useTheme();

  const { currentItem, modalShown, modalKey, modalProps } = useApp();

  return (
    <View background={colors.background} className="ezen-container">
      <Aside overlayed={modalShown} />
      {!!currentItem && !!currentItem?.id ? (
        <ContentFolder overlayed={modalShown} />
      ) : (
        <EmptyContent overlayed={modalShown} />
      )}
      {modalShown && (
        <View className="ezen-modal-wrapper" background={`${colors.text}66`}>
          {((currentKey = '', currentProps) => {
            const ModalComponent = AppModals[currentKey] || null;

            return ModalComponent ? <ModalComponent {...currentProps} /> : null;
          })(modalKey, modalProps)}
        </View>
      )}
    </View>
  );
};

export default MainScreen;
