import React, { useEffect, useState } from 'react';
import { StoreType } from 'types';
import { FILTER, ORDER } from 'configs';
import { Channels, DownloadItem } from 'models';

const StoreContext = React.createContext<StoreType>({});

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * DOWNLOAD LOCATION
   */
  const [downloadLocation, setDownloadLocation] = useState('');

  const updateLocation = () => {
    window.electron.ipcRenderer.sendMessage(
      Channels.SET_DEFAULT_DOWNLOAD_LOCATION,
      [downloadLocation]
    );
  };

  const handleFetchLocation = () => {
    window.electron.ipcRenderer.sendMessage(
      Channels.GET_DEFAULT_DOWNLOAD_LOCATION,
      []
    );
  };

  /**
   * DOWNLOAD ITEMS
   */
  const [items, setItems] = useState<DownloadItem[]>([]);

  const loadItems = async (
    search = '',
    filter = FILTER.DATE,
    filterOrder = ORDER.DESC
  ) => {
    window.electron.ipcRenderer.sendMessage(Channels.SEARCH_DOWNLOAD_ITEMS, [
      search,
      filter,
      filterOrder,
    ]);
  };

  const [currentItem, setCurrentItem] = useState<?DownloadItem>(null);

  const viewDetailsOf = (item: DownloadItem) => {
    setCurrentItem((old) => (old?.id === item?.id ? null : item));
  };

  const addNewPlaylist = (item: DownloadItem) => {
    const updated = [...items, item];
    setItems(updated);
    window.electron.ipcRenderer.sendMessage(Channels.PATCH_DOWNLOAD_ITEMS, [
      JSON.stringify(updated),
    ]);
  };

  useEffect(() => {
    handleFetchLocation();
    window.electron.ipcRenderer.on(
      Channels.GET_DEFAULT_DOWNLOAD_LOCATION,
      (path) => setDownloadLocation((path as string) || '')
    );
    window.electron.ipcRenderer.on(Channels.GET_DOWNLOAD_ITEMS, (itemsStr) => {
      try {
        setItems(JSON.parse(itemsStr as string));
      } catch (error) {
        // ignore
      }
    });
    return () => {
      window.electron.ipcRenderer.removeAllListeners(
        Channels.GET_DOWNLOAD_ITEMS
      );
    };
  }, []);

  return (
    <StoreContext.Provider
      value={{
        itemsList: items,
        loadItems,
        currentItem,
        viewDetailsOf,
        addDownloadItem: addNewPlaylist,

        downloadLocation,
        updateDownloadLocation: updateLocation,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => React.useContext(StoreContext);

export { useStore, StoreProvider, StoreContext };
