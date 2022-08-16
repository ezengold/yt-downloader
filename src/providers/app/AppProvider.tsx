import React, { useState } from 'react';
import { AppType, DownloadItem } from 'types';
import { DOWNLOAD_ITEMS_LIST } from 'dataset';

const AppContext = React.createContext<AppType>({});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadingItems, setLoadingItems] = useState(false);

  const [items, setItems] = useState<DownloadItem[]>([]);

  const loadItems = async (search = '', verbose = false) => {
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

  return (
    <AppContext.Provider
      value={{
        loadingItems,
        itemsList: items,
        loadItems,
        currentItem,
        viewDetailsOf,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => React.useContext(AppContext);

export { useApp, AppProvider, AppContext };
