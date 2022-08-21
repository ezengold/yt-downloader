import React, { useState } from 'react';
import { StoreType } from 'types';
import { DOWNLOAD_ITEMS_LIST } from 'dataset';
import { FILTER, ORDER } from 'configs';
import { DownloadItem } from 'models';

const StoreContext = React.createContext<StoreType>({});

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
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

  const addNewPlaylist = (item: DownloadItem) => {
    //
  };

  return (
    <StoreContext.Provider
      value={{
        loadingItems,
        itemsList: items,
        loadItems,
        currentItem,
        viewDetailsOf,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => React.useContext(StoreContext);

export { useStore, StoreProvider, StoreContext };
