import React, { useEffect, useState } from 'react';
import { View, Input, Text } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import { useApp } from 'providers/app';
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

const NewDownload = () => {
  const { colors } = useTheme();

  const [item, setItem] = useState<?DownloadItem>(null);

  const ref = React.useRef();

  const { closeModal, presentAlert } = useApp();

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
    if (
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\\-]+\?v=|embed\/|v\/)?)([\w\\-]+)(\S+)?$/.test(
        link
      )
    ) {
      setItem(null);
      setFetchingContents(true);
      window.electron.ipcRenderer.sendMessage(Channels.PLAYLIST_CONTENTS, [
        link,
      ]);
    } else {
      setError('Invalid URL');
      setItem(null);
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
                  size: new ItemSize(video?.size, SizeUnit.BYTES),
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

  useEffect(() => {
    document.addEventListener('keydown', closeOnEscape);
    window.electron.ipcRenderer.on(
      Channels.PLAYLIST_CONTENTS,
      onContentsReceived
    );
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      window.electron.ipcRenderer?.removeListener?.(
        Channels.PLAYLIST_CONTENTS,
        onContentsReceived
      );
    };
  }, [link]);

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
            <Text>Title : {item?.title}</Text>
            <div className="w-100 d-flex flex-wrap mb-3">
              <View className="d-flex align-items-center me-5">
                Owner :{' '}
                <Text
                  color={colors.yellow}
                  font={AppFonts.BOLD}
                  className="ms-1"
                >
                  {item?.owner || '-'}
                </Text>
              </View>
              <View className="d-flex align-items-center">
                Number of videos :{' '}
                <Text
                  color={colors.yellow}
                  font={AppFonts.BOLD}
                  className="ms-1"
                >
                  {item?.items?.length || 0}
                </Text>
              </View>
            </div>
            <Table
              mainColor={colors.principal}
              textColor={colors.text}
              className="w-100"
            >
              <tr>
                <th>N°</th>
                <th>Title</th>
              </tr>
              {item?.items?.map((subItem, index) => (
                <tr key={String(index)}>
                  <td>{index + 1}</td>
                  <td>{subItem?.title || ''}</td>
                </tr>
              ))}
            </Table>
          </Content>
        )}
        {!!item?.id && (
          <View
            className="ezen-btn text-uppercase mt-3 rounded-5"
            height="45px"
            color="white"
            background={colors.principal}
          >
            Start downloading
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
