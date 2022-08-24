import React, { useEffect, useState } from 'react';
import { View, Input, Text, Image } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import { useApp } from 'providers/app';
import { useStore } from 'providers/store';
import { useClickOutside } from 'hooks';
import { AiOutlineLink } from 'react-icons/ai';
import {
  Channels,
  DownloadItem,
  DownloadSubItem,
  ItemSize,
  ItemSpeed,
  Message,
  SizeUnit,
  SpeedUnit,
} from 'models';
import { BiSearchAlt } from 'react-icons/bi';
import moment from 'moment';
import { DATE_FORMAT, PENDING_STATUS } from 'configs';
import styled from 'styled-components';
import { prefeeredSizeOf } from 'helpers';

const NewDownload = () => {
  const { colors } = useTheme();

  const [item, setItem] = useState<DownloadItem>(null);

  const { addDownloadItem, downloadLocation, updateDownloadLocation } =
    useStore();

  const ref = React.useRef();

  const { closeModal, presentAlert } = useApp();

  const [showSizes, setShowSizes] = useState(false);

  const [seeding, setSeeding] = useState(false);

  const [fetchingContents, setFetchingContents] = useState(false);

  useClickOutside(ref, fetchingContents ? () => {} : closeModal);

  const closeOnEscape = (e: { key: string }) => {
    if (e?.key === 'Escape') closeModal();
  };

  const [link, setLink] = useState('');

  const [error, setError] = useState('');

  const onLinkChange = React.useCallback(
    (e) => setLink(e?.target?.value),
    [link]
  );

  const handleSubmit = () => {
    if (fetchingContents || seeding) return;
    if (
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\\-]+\?v=|embed\/|v\/)?)([\w\\-]+)(\S+)?$/.test(
        link
      )
    ) {
      setItem(null);
      setShowSizes(false);
      setFetchingContents(true);
      window.electron.ipcRenderer.sendMessage(Channels.PLAYLIST_CONTENTS, [
        link,
      ]);
    } else {
      setError('Invalid URL');
      setItem(null);
      setShowSizes(false);
      setTimeout(() => {
        setError('');
      }, 2000);
    }
  };

  const onContentsReceived = (str?: string) => {
    setFetchingContents(false);

    const response = new Message<object | string>(str as string);

    if (response?.success) {
      const newItem = new DownloadItem({
        id: String(Date.now()),
        title: response?.value?.title || '',
        playlist_id: response?.value?.playlist_id || '',
        url: response?.value?.playlist_url || link || '',
        addedAt: moment().format(DATE_FORMAT),
        status: PENDING_STATUS,
        currentSpeed: new ItemSpeed(0, SpeedUnit.BS),
        totalSize: new ItemSize(0, SizeUnit.BYTES),
        currentSize: new ItemSize(0, SizeUnit.BYTES),
        img: '',
        owner: response?.value?.owner || '',
        items: Array.isArray(response?.value?.videos)
          ? response?.value?.videos?.map(
              (video, index) =>
                new DownloadSubItem({
                  id: String(index),
                  video_id: video?.videoId || '',
                  title: video?.title || '',
                  description: video?.shortDescription || '',
                  size: new ItemSize(video?.size || 0, SizeUnit.BYTES),
                  currentSize: new ItemSize(0, SizeUnit.BYTES),
                  status: PENDING_STATUS,
                  img: Array.isArray(video?.thumbnail?.thumbnails)
                    ? video?.thumbnail?.thumbnails[
                        video?.thumbnail?.thumbnails?.length - 1
                      ]?.url || ''
                    : '',
                  author: video?.author || '',
                  numberOfSeconds: parseInt(video?.lengthSeconds, 10),
                  speed: new ItemSpeed(0, SpeedUnit.BS),
                })
            )
          : [],
      });
      newItem.totalSize = new ItemSize(
        newItem?.items?.reduce(
          (prev, current) => prev + current?.size?.value,
          0
        ),
        SizeUnit.BYTES
      );
      newItem.img = newItem.items?.at(0)?.img || '';
      setItem(newItem);
    } else {
      presentAlert({ kind: 'error', message: response?.value as string });
    }
  };

  const handleStartDownload = () => {
    if (!seeding) {
      setShowSizes(true);
      setSeeding(true);
      window.electron.ipcRenderer.sendMessage(Channels.SEED_VIDEO_SIZE, [
        JSON.stringify(item?.items?.map((el) => el?.video_id)),
      ]);
    }
  };

  const handleAddDownloadItem = React.useCallback(
    (str?: string) => {
      const response = new Message<any>(str as string);

      if (response?.success) {
        if (Array.isArray(response?.value)) {
          const updatedItem: DownloadItem = {
            ...item,
            location: downloadLocation,
            items: item?.items?.map((el) => {
              const current = response?.value?.find(
                (s: any) => s?.video_id === el?.video_id
              );

              return current
                ? {
                    ...el,
                    size: new ItemSize(
                      current?.video_size || 0,
                      SizeUnit.BYTES
                    ),
                  }
                : el;
            }),
          };

          updatedItem.totalSize = new ItemSize(
            updatedItem?.items?.reduce(
              (prev, current) => prev + current?.size?.value,
              0
            ),
            SizeUnit.BYTES
          );

          setItem(updatedItem);

          if (updatedItem && updatedItem?.id) {
            setTimeout(() => {
              setSeeding(false);
              addDownloadItem(updatedItem);
              closeModal();
            }, 3000);
          } else {
            presentAlert({
              kind: 'error',
              message: 'An unexpected error occures !',
            });
            setSeeding(false);
          }
        }
      } else {
        setSeeding(false);
        presentAlert({ kind: 'error', message: response?.value as string });
      }
    },
    [item, downloadLocation]
  );

  useEffect(() => {
    document.addEventListener('keydown', closeOnEscape);
    window.electron.ipcRenderer.on(
      Channels.PLAYLIST_CONTENTS,
      onContentsReceived
    );
    window.electron.ipcRenderer.on(
      Channels.SEED_VIDEO_SIZE,
      handleAddDownloadItem
    );
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      window.electron.ipcRenderer?.removeAllListeners(
        Channels.PLAYLIST_CONTENTS
      );
      window.electron.ipcRenderer?.removeAllListeners(Channels.SEED_VIDEO_SIZE);
    };
  }, [link, item]);

  return (
    <div
      className="w-100 h-100 d-flex flex-column align-items-center position-relative"
      style={{ paddingTop: '15vh' }}
    >
      {!!error && (
        <View
          background={`${colors.card}`}
          color={colors.red}
          className="p-3 rounded-10 position-absolute text-center"
          style={{
            top: '50px',
            minWidth: '200px',
            maxWidth: '600px',
            animation: 'fadeInDown 0.1s',
          }}
        >
          {error}
        </View>
      )}
      <View
        ref={ref}
        className="ezen-modal rounded-15"
        width="600px"
        height={item?.id ? '60vh' : '85px'}
        background={colors.card}
        style={{ padding: '20px', transition: 'height 0.1s ease-in-out' }}
      >
        <View
          width="100%"
          height="45px"
          radius="5px"
          border={`1px solid ${error ? colors.red : colors.principal}`}
          className="d-flex align-items-center justify-content-between"
        >
          <Input
            containerClassName="h-100 border-0 bg-transparent"
            containerStyle={{ width: 'calc(100% - 105px)' }}
            placeholder="Paste the playlist link here"
            iconLeft={
              <AiOutlineLink
                size={17}
                color={error ? colors.red : colors.principal}
                className="mx-2"
              />
            }
            value={link}
            onChange={onLinkChange}
            autoFocus
          />
          <View
            className="ezen-btn h-100 rounded-0"
            width="100px"
            background={`${error ? colors.red : colors.principal}1A`}
            style={{
              borderLeft: `1px solid ${error ? colors.red : colors.principal}`,
            }}
            color={error ? colors.red : colors.principal}
            font={AppFonts.BOLD}
            onClick={handleSubmit}
          >
            {fetchingContents ? (
              <BiSearchAlt
                size={18}
                className="animate__animated animate__heartBeat animate__tada animate__infinite	infinite"
              />
            ) : (
              'Search'
            )}
          </View>
        </View>
        {!!item?.id && (
          <Content className="w-100 mt-3 pb-5">
            <div className="w-100 d-flex align-items-start mb-3">
              <Image
                src={item?.img}
                height="80px"
                width="80px"
                resizeMode="cover"
                radius="10px"
                className="me-4"
              />
              <div className="d-flex flex-column">
                <Text>Title : {item?.title}</Text>
                <View className="d-flex flex-wrap align-items-center my-2">
                  Owner :{' '}
                  <Text
                    color={colors.yellow}
                    font={AppFonts.BOLD}
                    className="ms-1 me-4"
                  >
                    {item?.owner || '-'}
                  </Text>
                  Number of videos :{' '}
                  <Text
                    color={colors.yellow}
                    font={AppFonts.BOLD}
                    className="ms-1 me-4"
                  >
                    {item?.items?.length || '0'}
                  </Text>
                  {showSizes && (
                    <>
                      Total size :
                      <Text
                        color={colors.yellow}
                        font={AppFonts.BOLD}
                        className="ms-1"
                      >
                        {prefeeredSizeOf(item?.totalSize)?.value?.toFixed(2)}{' '}
                        {prefeeredSizeOf(item?.totalSize)?.unit?.title || '-'}
                      </Text>
                    </>
                  )}
                </View>
                <View className="d-flex align-items-center">
                  Saving location :{' '}
                  <Text
                    color={colors.principal}
                    font={AppFonts.REGULAR}
                    className="ms-1 cursor-pointer"
                    onClick={!seeding ? updateDownloadLocation : () => {}}
                  >
                    {downloadLocation}
                  </Text>
                </View>
              </div>
            </div>
            <Table
              mainColor={colors.principal}
              textColor={colors.text}
              className="w-100"
            >
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Title</th>
                  {showSizes && <th>Size</th>}
                </tr>
              </thead>
              <tbody>
                {item?.items?.map((subItem, index) => (
                  <tr key={String(index)}>
                    <td>{index + 1}</td>
                    <td>{subItem?.title || ''}</td>
                    {showSizes && (
                      <td className="white-space-nowrap">
                        {prefeeredSizeOf(subItem?.size)?.value?.toFixed(2) ||
                          '0'}{' '}
                        {prefeeredSizeOf(subItem?.size)?.unit?.title || '-'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Content>
        )}
        {!!item?.id && (
          <View
            className="ezen-btn text-uppercase mt-3 rounded-5"
            height="45px"
            color={seeding ? colors.principal : 'white'}
            border={seeding ? `1px solid ${colors.principal}` : '0px solid'}
            background={seeding ? 'transparent' : colors.principal}
            onClick={handleStartDownload}
          >
            {seeding ? 'Seeding...' : 'Start downloading'}
          </View>
        )}
      </View>
    </div>
  );
};

export default NewDownload;

const Table = styled.table`
  width: 100%;
  border: 1px solid ${({ textColor }) => textColor || '#000000'}4D;
  border-collapse: collapse;
  th {
    border: 1px solid ${({ textColor }) => textColor || '#000000'}4D;
    padding: 10px;
    font-family: ${AppFonts.BOLD};
    color: ${({ mainColor }) => mainColor || '#000'};
  }
  td {
    border: 1px solid ${({ textColor }) => textColor || '#000000'}4D;
    padding: 10px;
    font-family: ${AppFonts.REGULAR};
    color: ${({ textColor }) => textColor || '#000'};
  }
`;

const Content = styled.div`
  height: calc(100% - 115px);
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  ::-webkit-scrollbar-track {
    display: none;
  }
  ::-webkit-scrollbar-thumb {
    display: none;
  }
  ::-webkit-scrollbar-corner {
    display: none;
  }
  ::-webkit-scrollbar-button {
    display: none;
  }
`;
