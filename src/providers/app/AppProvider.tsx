import React, { useState } from 'react';
import { AppType, PresentAlertProps, PresentModalProps } from 'types';

const AppContext = React.createContext<AppType>({});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * Handle global modal
   */
  const [modalShown, setModalShown] = useState(false);

  // First element hold on hide callback provided
  const [modalCallbacks, setModalCallbacks] = useState<Function[]>([() => {}]);

  // key of the current modal
  const [modalKey, setModalKey] = useState('');

  // props of the current modal
  const [modalProps, setModalProps] = useState<object>({});

  const handleShowModal = (props: PresentModalProps) => {
    setModalShown(true);
    setModalKey(props.modalKey);
    setModalProps(props?.modalProps);
    setModalCallbacks([
      typeof props.onHide === 'function' ? props.onHide : () => {},
    ]);
  };

  const handleCloseModal = (...args: any[]) => {
    setModalShown(false);
    setModalKey('');
    setModalProps({});
    if (typeof modalCallbacks[0] === 'function') modalCallbacks[0](...args);
    setModalCallbacks([() => {}]);
  };

  /**
   * Handle alerts
   */
  const DefaultAlert = { message: '', kind: 'success' };

  const [alertShown, setAlertShown] = useState(false);

  const [currentAlert, setCurrentAlert] = useState(DefaultAlert);

  const handleShowAlert = (props: PresentAlertProps) => {
    setCurrentAlert({
      kind: props?.kind || 'success',
      message: props?.message || '',
    });
    setAlertShown(true);
    setTimeout(() => {
      setAlertShown(false);
      setCurrentAlert(DefaultAlert);
    }, props?.duration || 5000);
  };

  return (
    <AppContext.Provider
      value={{
        // modal
        modalShown,
        presentModal: handleShowModal,
        closeModal: handleCloseModal,
        modalKey,
        modalProps,

        // alert
        alertShown,
        alert: currentAlert,
        presentAlert: handleShowAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => React.useContext(AppContext);

export { useApp, AppProvider, AppContext };
