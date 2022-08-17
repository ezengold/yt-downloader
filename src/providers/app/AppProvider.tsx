import React, { useState } from 'react';
import { AppType, DownloadItem, PresentModalProps } from 'types';
import { DOWNLOAD_ITEMS_LIST } from 'dataset';
import { FILTER, ORDER } from 'configs';

const AppContext = React.createContext<AppType>({});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadingItems, setLoadingItems] = useState(false);

  const [items, setItems] = useState<DownloadItem[]>([]);

  const loadItems = async (
    search = '',
    filter = FILTER.DATE,
    filterOrder = ORDER.DESC,
    verbose = false
  ) => {
    setLoadingItems(verbose);
    setTimeout(
      () => {
        setItems(
          DOWNLOAD_ITEMS_LIST.filter((el) =>
            el?.title?.toUpperCase().includes(String(search?.toUpperCase()))
          )
        );
        setLoadingItems(false);
      },
      verbose ? 200 : 0
    );
  };

  const [currentItem, setCurrentItem] = useState<?DownloadItem>(null);

  const viewDetailsOf = (item: DownloadItem) => {
    setCurrentItem((old) => (old?.id === item?.id ? null : item));
  };

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
    setModalProps(props.modalProps);
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

  return (
    <AppContext.Provider
      value={{
        loadingItems,
        itemsList: items,
        loadItems,
        currentItem,
        viewDetailsOf,

        // modal
        modalShown,
        presentModal: handleShowModal,
        closeModal: handleCloseModal,
        modalKey,
        modalProps,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => React.useContext(AppContext);

export { useApp, AppProvider, AppContext };
