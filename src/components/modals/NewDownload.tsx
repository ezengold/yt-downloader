import React, { useEffect, useState } from 'react';
import { View, Input } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import { useApp } from 'providers/app';
import { useClickOutside } from 'hooks';
import { AiOutlineLink } from 'react-icons/ai';

const NewDownload = () => {
  const { colors } = useTheme();

  const ref = React.useRef();

  const { closeModal } = useApp();

  useClickOutside(ref, closeModal);

  const closeOnEscape = (e) => {
    if (e?.key === 'Escape') closeModal();
  };

  useEffect(() => {
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const [link, setLink] = useState('');

  const onLinkChange = React.useCallback(
    (e) => setLink(e?.target?.value),
    [link]
  );

  return (
    <div
      className="w-100 h-100 d-flex flex-column align-items-center"
      style={{ paddingTop: '15vh' }}
    >
      <View
        ref={ref}
        className="ezen-modal rounded-15"
        width="600px"
        height={link ? '60vh' : '85px'}
        background={colors.card}
        style={{ padding: '20px', transition: 'height 0.1s ease-in-out' }}
      >
        <View
          width="100%"
          height="45px"
          radius="5px"
          border={`1px solid ${colors.principal}`}
          className="d-flex align-items-center justify-content-between"
        >
          <Input
            containerClassName="h-100 border-0 bg-transparent"
            containerStyle={{ width: 'calc(100% - 160px)' }}
            placeholder="Paste the playlist link here"
            iconLeft={
              <AiOutlineLink
                size={17}
                color={colors?.principal}
                className="mx-2"
              />
            }
            value={link}
            onChange={onLinkChange}
          />
          <View
            className="ezen-btn h-100 rounded-0"
            width="150px"
            background={`${colors.principal}1A`}
            style={{ borderLeft: `1px solid ${colors.principal}` }}
            color={colors.principal}
            font={AppFonts.BOLD}
            onClick={() => closeModal()}
          >
            Download
          </View>
        </View>
      </View>
    </div>
  );
};

export default NewDownload;
