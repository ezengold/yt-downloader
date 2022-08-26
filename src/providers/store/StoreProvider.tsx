import React, { useEffect, useState } from 'react';
import { StoreType } from 'types';
import {
  CANCELED_STATUS,
  COMPLETED_STATUS,
  EXPIRED_STATUS,
  FILTER,
  ORDER,
  PENDING_STATUS,
  RUNNING_STATUS,
} from 'configs';
import {
  Channels,
  DownloadItem,
  ItemSize,
  ItemSpeed,
  Message,
  SizeUnit,
  SpeedUnit,
} from 'models';
import { useApp } from 'providers/app';
import { useDebounce } from 'hooks';
import moment from 'moment';

const StoreContext = React.createContext<StoreType>({});

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { presentAlert, modalShown } = useApp();

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

  const onLoadItems = (itemsStr?: string) => {
    try {
      let data: DownloadItem[] = JSON.parse(itemsStr as string);

      // check expired links
      data = Array.isArray(data)
        ? data.map((it) => ({
            ...it,
            items: Array.isArray(it?.items)
              ? it?.items?.map((sub) => ({
                  ...sub,
                  status:
                    !!sub?.download_url &&
                    moment(sub?.expires_at).isAfter(moment())
                      ? sub?.status
                      : EXPIRED_STATUS,
                }))
              : [],
          }))
        : [];

      // items with only expired and completed subitems will come completed
      data = data?.map((it) => ({
        ...it,
        status: it?.items?.some(
          (sub) => ![COMPLETED_STATUS, EXPIRED_STATUS].includes(sub?.status)
        )
          ? it?.status
          : COMPLETED_STATUS,
      }));

      // all pending and running items on loading come canceled
      data = data?.map((it) =>
        [RUNNING_STATUS, PENDING_STATUS].includes(it?.status)
          ? {
              ...it,
              status: CANCELED_STATUS,
              error: 'Download canceled',
              currentSpeed: new ItemSpeed(0, SpeedUnit.BS),
              items: it?.items?.map((sub) =>
                ![COMPLETED_STATUS, EXPIRED_STATUS].includes(sub?.status)
                  ? {
                      ...sub,
                      status: CANCELED_STATUS,
                      error: 'Download canceled',
                      currentSize: new ItemSize(0, SizeUnit.BYTES),
                    }
                  : sub
              ),
            }
          : it
      );

      setItems(data);
    } catch (error) {
      // ignore
    }
  };

  const updateItemsInStorage = () => {
    window.electron.ipcRenderer.sendMessage(Channels.PATCH_DOWNLOAD_ITEMS, [
      JSON.stringify(items),
    ]);
  };

  useDebounce(updateItemsInStorage, 2000, [items]);

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

  const [downloadingItem, setDownloadingItem] = useState<?DownloadItem>(null);

  const viewDetailsOf = (item: DownloadItem) => {
    setCurrentItem((old) => (old?.id === item?.id ? null : item));
  };

  const addNewPlaylist = React.useCallback(
    (item: DownloadItem) => {
      if (canStartNewDownload(item?.id)) {
        const updated = {
          ...item,
          status: RUNNING_STATUS,
        };
        const updatedItems = [...items, updated];
        setCurrentItem(updated);
        setDownloadingItem(updated);
        setItems(updatedItems);

        window.electron.ipcRenderer.sendMessage(
          Channels.START_VIDEOS_DOWNLOAD,
          [
            JSON.stringify(
              updated?.items
                ?.filter((el) =>
                  [PENDING_STATUS, CANCELED_STATUS].includes(el?.status)
                )
                ?.map((el) => ({
                  video_id: el?.video_id,
                  download_url: el?.download_url,
                  location: `${updated?.location}/${el?.title?.replaceAll(
                    /[^a-z0-9]/gi,
                    '_'
                  )}.mp4`,
                }))
            ),
          ]
        );
      } else {
        const updatedItems = [...items, item];
        setItems(updatedItems);
        setCurrentItem(item);
      }
    },
    [items, downloadingItem, currentItem, modalShown]
  );

  const deleteDownloadItems = (itemsIds: string[]) => {
    // remove eventual downloading item id
    const pureItemsIds = itemsIds.filter((el) => el !== downloadingItem?.id);

    setItems((old) => old.filter((it) => !pureItemsIds.includes(it?.id)));

    if (itemsIds.includes(currentItem?.id)) setCurrentItem(null);

    presentAlert({
      kind: 'success',
      message: 'Items removed successfully !',
    });
  };

  const deleteItemVideos = (itemId: string, subItemsIds: string[]) => {
    if (itemId !== downloadingItem?.id) {
      // cannot delete items on current downloading item
      const updated = items?.find((el) => el?.id === itemId);

      if (updated) {
        updated.items = updated.items?.filter(
          (el) => !subItemsIds?.includes(el?.id)
        );
        updated.totalSize = new ItemSize(
          updated.items?.reduce(
            (prev, current) => prev + current?.size?.value,
            0
          ),
          SizeUnit.BYTES
        );
        if (updated.items.length === 0) {
          // remove item
          deleteDownloadItems([itemId]);
        } else {
          if (itemId === currentItem?.id) setCurrentItem(updated);
          setItems((old) =>
            old.map((el) => (el?.id === itemId ? updated : el))
          );
          presentAlert({
            kind: 'success',
            message: 'All selected videos are successfully deleted !',
          });
        }
      }
    }
  };

  const canStartNewDownload = React.useCallback(
    (itemId: string) => {
      if (!downloadingItem) {
        return true;
      } else {
        if (itemId === downloadingItem?.id) {
          presentAlert({
            kind: 'success',
            message: 'Another download is running !',
          });
        } else {
          presentAlert({
            kind: 'success',
            message: 'Download already running !',
          });
        }
        return false;
      }
    },
    [items, currentItem, downloadingItem]
  );

  const purifedVideos = (
    videos: {
      video_id: string;
      download_url: string;
      location: string;
      expires_at: string;
    }[]
  ) => {
    const validVideos = videos.filter(
      (el) => !!el?.download_url && moment(el?.expires_at).isAfter(moment())
    );

    if (videos.length > 0 && validVideos.length === videos.length) {
      // all videos url are valid
      return videos;
    } else if (videos.length > 0 && videos.length - validVideos.length > 0) {
      // change status of expired link
      return validVideos;
    } else {
      return [];
    }
  };

  const performDownload = React.useCallback(
    (itemId: string) => {
      if (canStartNewDownload(itemId)) {
        const itemIndex = items?.findIndex((el) => el?.id === itemId);
        if (itemIndex !== -1) {
          const updated = items[itemIndex];

          updated.items = updated.items?.map((el) =>
            el?.status !== COMPLETED_STATUS
              ? {
                  ...el,
                  status: PENDING_STATUS,
                }
              : el
          );

          updated.status = COMPLETED_STATUS;

          const downloadables = updated?.items
            ?.filter((el) =>
              [PENDING_STATUS, CANCELED_STATUS].includes(el?.status)
            )
            ?.map((el) => ({
              video_id: el?.video_id || '',
              download_url: el?.download_url,
              location: `${updated?.location}/${el?.title?.replaceAll(
                /[^a-z0-9]/gi,
                '_'
              )}.mp4`,
              expires_at: el?.expires_at,
            }));

          const videosToDownload = purifedVideos(downloadables);

          // change status of expired items (items not in videosToDownload)
          updated.items?.map((sub) => ({
            ...sub,
            status: videosToDownload?.some(
              (vid) => vid?.video_id === sub?.video_id
            )
              ? sub.status
              : sub.status === RUNNING_STATUS
              ? RUNNING_STATUS
              : EXPIRED_STATUS,
          }));

          if (videosToDownload.length > 0) {
            updated.status = RUNNING_STATUS;

            window.electron.ipcRenderer.sendMessage(
              Channels.START_VIDEOS_DOWNLOAD,
              [JSON.stringify(videosToDownload)]
            );

            if (currentItem?.id === itemId) setCurrentItem(updated);

            setDownloadingItem(updated);

            setItems((old) =>
              old?.map((it) => (it?.id === itemId ? updated : it))
            );
          } else {
            updated.status = COMPLETED_STATUS;

            if (currentItem?.id === itemId) setCurrentItem(updated);

            setItems((old) =>
              old?.map((it) => (it?.id === itemId ? updated : it))
            );
          }
        }
      }
    },
    [items, currentItem, downloadingItem]
  );

  const stopDownload = (itemId: string) => {
    window.electron.ipcRenderer.sendMessage(
      Channels.CANCEL_VIDEOS_DOWNLOAD,
      []
    );
    if (itemId === downloadingItem?.id) setDownloadingItem(null);
    if (currentItem?.id === itemId) {
      const updatedCurrentItem = {
        ...currentItem,
        status: CANCELED_STATUS,
        currentSpeed: new ItemSpeed(0, SpeedUnit.BS),
        error: 'Download canceled',
        items: currentItem?.items?.map((sub) =>
          ![COMPLETED_STATUS, EXPIRED_STATUS].includes(sub?.status)
            ? {
                ...sub,
                currentSize: new ItemSize(0, SizeUnit.BYTES),
                status: CANCELED_STATUS,
                error: 'Download canceled',
              }
            : sub
        ),
      };
      setCurrentItem(updatedCurrentItem);
    }
    setItems((old) =>
      old?.map((it) =>
        it?.id === itemId
          ? {
              ...it,
              status: CANCELED_STATUS,
              currentSpeed: new ItemSpeed(0, SpeedUnit.BS),
              error: 'Download canceled',
              items: it?.items?.map((sub) =>
                ![COMPLETED_STATUS, EXPIRED_STATUS].includes(sub?.status)
                  ? {
                      ...sub,
                      currentSize: new ItemSize(0, SizeUnit.BYTES),
                      status: CANCELED_STATUS,
                      error: 'Download canceled',
                    }
                  : sub
              ),
            }
          : it
      )
    );
  };

  const onSubscribedDownloadsEnd = React.useCallback(
    (str?: string) => {
      if (downloadingItem) {
        const response = new Message<any>(str as string);

        if (response?.success) {
          if (response?.value?.status === Channels.DOWNLOAD_FINISHED) {
            const updatedItem = downloadingItem;

            updatedItem.status = COMPLETED_STATUS;
            updatedItem.currentSpeed = new ItemSpeed(0, SpeedUnit.BS);

            setItems((old) =>
              old?.map((it) => (it?.id === updatedItem?.id ? updatedItem : it))
            );
            setDownloadingItem(null);

            if (updatedItem?.id === currentItem?.id)
              setCurrentItem(updatedItem);

            presentAlert({
              kind: 'success',
              message: `Download of "${updatedItem?.title}" finished !`,
            });
          } else {
            const updatedItem = downloadingItem;
            updatedItem.status = CANCELED_STATUS;
            updatedItem.error = response?.value?.error;

            if (updatedItem?.id === currentItem?.id)
              setCurrentItem(updatedItem);

            setItems((old) =>
              old?.map((it) => (it?.id === updatedItem?.id ? updatedItem : it))
            );

            setDownloadingItem(null);

            presentAlert({
              kind: 'error',
              message: response?.value?.error as string,
            });
          }
        } else {
          const updatedItem = downloadingItem;
          updatedItem.status = CANCELED_STATUS;
          updatedItem.error = response?.value?.error;

          if (updatedItem?.id === currentItem?.id) setCurrentItem(updatedItem);

          setItems((old) =>
            old?.map((it) => (it?.id === updatedItem?.id ? updatedItem : it))
          );

          setDownloadingItem(null);

          presentAlert({
            kind: 'error',
            message: response?.value?.error as string,
          });
        }
      }
    },
    [items, currentItem, downloadingItem]
  );

  const onDownloadsProgressing = React.useCallback(
    (str?: string) => {
      if (downloadingItem) {
        const response = new Message<any>(str as string);
        const videoId: string = response?.value?.video_id;

        if (response?.success) {
          if (response?.value?.status === Channels.DOWNLOAD_PROCESSING) {
            const updatedItem = downloadingItem;
            // TODO
            updatedItem.currentSpeed = new ItemSpeed(
              parseInt(response?.value?.speed, 10) || 0,
              SpeedUnit.BS
            );

            updatedItem.items = updatedItem.items?.map((el) =>
              el?.video_id === videoId
                ? {
                    ...el,
                    status: RUNNING_STATUS,
                    currentSize: new ItemSize(
                      parseInt(response?.value?.downloaded, 10) || 0,
                      SizeUnit.BYTES
                    ),
                    speed: new ItemSpeed(
                      parseInt(response?.value?.speed, 10) || 0,
                      SpeedUnit.BS
                    ),
                  }
                : el
            );

            setDownloadingItem(updatedItem);

            if (updatedItem?.id === currentItem?.id)
              setCurrentItem(updatedItem);

            setItems((old) =>
              old?.map((it) => (it?.id === updatedItem?.id ? updatedItem : it))
            );
          } else if (response?.value?.status === Channels.DOWNLOAD_FINISHED) {
            const updatedItem = downloadingItem;

            updatedItem.items = updatedItem.items?.map((el) =>
              el?.video_id === videoId
                ? {
                    ...el,
                    status: COMPLETED_STATUS,
                    currentSize: new ItemSize(el?.size?.value, SizeUnit.BYTES),
                    speed: new ItemSpeed(0, SpeedUnit.BS),
                  }
                : el
            );

            setDownloadingItem(updatedItem);

            if (updatedItem?.id === currentItem?.id)
              setCurrentItem(updatedItem);

            setItems((old) =>
              old?.map((it) => (it?.id === updatedItem?.id ? updatedItem : it))
            );
          } else if (response?.value?.status === Channels.DOWNLOAD_FAILED) {
            const updatedItem = downloadingItem;

            updatedItem.items = updatedItem.items?.map((el) =>
              el?.video_id === videoId
                ? {
                    ...el,
                    status: CANCELED_STATUS,
                    error: response?.value?.error || 'Unexpected error occured',
                    speed: new ItemSpeed(0, SpeedUnit.BS),
                  }
                : el
            );

            setDownloadingItem(updatedItem);

            if (updatedItem?.id === currentItem?.id)
              setCurrentItem(updatedItem);

            setItems((old) =>
              old?.map((it) => (it?.id === updatedItem?.id ? updatedItem : it))
            );
          }
        } else {
          const updatedItem = downloadingItem;

          updatedItem.items = updatedItem.items?.map((el) =>
            el?.video_id === videoId
              ? {
                  ...el,
                  status: CANCELED_STATUS,
                  error:
                    typeof response?.value?.error === 'string'
                      ? response?.value?.error || 'Unexpected error occured'
                      : 'Unexpected error occured',
                  speed: new ItemSpeed(0, SpeedUnit.BS),
                }
              : el
          );

          setDownloadingItem(updatedItem);

          if (updatedItem?.id === currentItem?.id) setCurrentItem(updatedItem);

          setItems((old) =>
            old?.map((it) => (it?.id === updatedItem?.id ? updatedItem : it))
          );
        }
      }
    },
    [items, downloadingItem, currentItem]
  );

  useEffect(() => {
    handleFetchLocation();
    setDownloadingItem(null);
    setCurrentItem(null);
    window.electron.ipcRenderer.on(
      Channels.GET_DEFAULT_DOWNLOAD_LOCATION,
      (path) => setDownloadLocation((path as string) || '')
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      Channels.START_VIDEOS_DOWNLOAD,
      onSubscribedDownloadsEnd
    );
    window.electron.ipcRenderer.on(
      Channels.DOWNLOAD_PROGRESSION,
      onDownloadsProgressing
    );
    window.electron.ipcRenderer.on(Channels.GET_DOWNLOAD_ITEMS, onLoadItems);
    return () => {
      window.electron.ipcRenderer.removeAllListeners(
        Channels.GET_DOWNLOAD_ITEMS
      );
      window.electron.ipcRenderer.removeAllListeners(
        Channels.START_VIDEOS_DOWNLOAD
      );
      window.electron.ipcRenderer.removeAllListeners(
        Channels.DOWNLOAD_PROGRESSION
      );
    };
  }, [items, downloadingItem, currentItem, modalShown]);

  return (
    <StoreContext.Provider
      value={{
        itemsList: items,
        loadItems,
        currentItem,
        viewDetailsOf,
        addDownloadItem: addNewPlaylist,

        performDownload,
        stopDownload,

        deleteDownloadItems,
        deleteItemVideos,

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
