import React, { useState } from 'react';
import { View } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import { useApp } from 'providers/app';
import { useClickOutside } from 'hooks';
import { SeeAbout, SetLocation, SetTheme } from 'screens/settings';
import styled from 'styled-components';

const SettingsModal = (props: { defaultIndex?: number }) => {
  const ref = React.useRef();

  const { colors } = useTheme();

  const { closeModal } = useApp();

  useClickOutside(ref, () => closeModal());

  // tabs
  const tabs = [<SetLocation />, <SetTheme />, <SeeAbout />];

  const [currentIndex, setCurrentIndex] = useState(props.defaultIndex || 0);

  return (
    <View
      ref={ref}
      className="ezen-modal p-4 rounded-25"
      width="60%"
      height="75%"
      background={colors.card}
    >
      <View
        width="100%"
        radius="10px"
        background={`${colors.principal}26`}
        className="d-flex align-items-center p-3"
      >
        {[0, 1, 2].map((tabIndex) => (
          <TabItem
            key={tabIndex}
            font={AppFonts.BOLD}
            mainColor={colors.principal}
            hoverColor={`${colors.principal}26`}
            className={`ezen-btn rounded-5 ${
              tabIndex === currentIndex ? 'active' : ''
            }`}
            onClick={() => setCurrentIndex(tabIndex)}
          >
            {
              {
                0: 'Default location',
                1: 'Theme',
                2: 'About',
              }[tabIndex]
            }
          </TabItem>
        ))}
      </View>
      <Content
        indicatorForeground={colors.text}
        indicatorBackground={colors.background}
        className="mt-4"
      >
        {tabs[currentIndex]}
      </Content>
    </View>
  );
};

export default SettingsModal;

const Content = styled.div`
  width: 100%;
  height: calc(100% - 105px);
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    border: 0px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px
      ${({ indicatorBackground }) => indicatorBackground || '#ddd'};
    border-radius: 15px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${({ indicatorForeground }) =>
      indicatorForeground || '#aaaaaa'}55;
    border-radius: 15px;
  }
  ::-webkit-scrollbar-corner {
    display: none;
  }
  ::-webkit-scrollbar-button {
    display: none;
  }
`;

const TabItem = styled.div`
  margin-right: 10px;
  width: 150px;
  height: 50px;
  background: transparent;
  color: ${({ mainColor }) => mainColor || '#0000'};
  font-family: ${({ font }) => font || undefined};
  &:hover {
    background: ${({ hoverColor }) => hoverColor || '#0000'};
  }
  &.active {
    color: white;
    background: ${({ mainColor }) => mainColor || '#0000'} !important;
  }
`;
