import React, { useEffect, useState } from 'react';
import { View, Input } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import { useApp } from 'providers/app';
import { useClickOutside } from 'hooks';
import { AiOutlineLink } from 'react-icons/ai';
import { Channels, DownloadItem } from 'models';
import { DOWNLOAD_ITEMS_LIST } from 'dataset';
import { BiSearchAlt } from 'react-icons/bi';

const NewDownload = () => {
  const { colors } = useTheme();

  const [item, setItem] = useState<?DownloadItem>(null);

  const ref = React.useRef();

  const { closeModal } = useApp();

  useClickOutside(ref, closeModal);

  const closeOnEscape = (e: { key: string }) => {
    if (e?.key === 'Escape') closeModal();
  };

  useEffect(() => {
    document.addEventListener('keydown', closeOnEscape);
    window.electron.ipcRenderer.on(Channels.PLAYLIST_CONTENTS, (...args) => {
      console.log({ args });
    });
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const [link, setLink] = useState('');

  const [error, setError] = useState('');

  const onLinkChange = React.useCallback(
    (e) => setLink(e?.target?.value),
    [link]
  );

  const [fetchingContents, setFetchingContents] = useState(false);

  const handleSubmit = () => {
    if (
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(
        link
      )
    ) {
      setFetchingContents(true);
      setTimeout(() => {
        setFetchingContents(false);
        window.electron.ipcRenderer.sendMessage(Channels.PLAYLIST_CONTENTS, [
          link,
        ]);
        // setItem(DOWNLOAD_ITEMS_LIST[0]);
      }, 5000);
    } else {
      setError('Invalid URL');
      setItem(null);
      setTimeout(() => {
        setError('');
      }, 2000);
    }
  };

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
      </View>
    </div>
  );
};

export default NewDownload;
