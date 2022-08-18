import React, { useEffect } from 'react';
import { View, ConfirmDelete, SettingsModal, NewDownload } from 'components';
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
  [MODALS.NEW_DOWNLOAD]: NewDownload,
};

const MainScreen = () => {
  const { colors } = useTheme();

  const { currentItem, modalShown, modalKey, modalProps, presentModal } =
    useApp();

  const openSettings = () => {
    presentModal({ modalKey: MODALS.SETTINGS });
  };

  const openAbout = () => {
    presentModal({
      modalKey: MODALS.SETTINGS,
      modalProps: { defaultIndex: 2 },
    });
  };

  const openNewDownload = () => {
    presentModal({ modalKey: MODALS.NEW_DOWNLOAD });
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('openSettings', openSettings);
    window.electron.ipcRenderer.on('openAbout', openAbout);
    window.electron.ipcRenderer.on('openNewDownload', openNewDownload);
    return () => {
      window.electron.ipcRenderer?.removeListener?.(
        'openSettings',
        openSettings
      );
      window.electron.ipcRenderer?.removeListener?.('openAbout', openAbout);
      window.electron.ipcRenderer?.removeListener?.(
        'openNewDownload',
        openNewDownload
      );
    };
  }, []);

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
