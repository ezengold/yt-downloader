import React from 'react';
import { Text, Checkbox } from 'components';
import { CgMoreO } from 'react-icons/cg';
import { MoreButtonProps } from 'types';
import { useTheme } from 'providers/theme';
import styled from 'styled-components';
import { useClickOutside, useToggle } from 'hooks';
import { BsFilter } from 'react-icons/bs';
import { AiOutlineSetting } from 'react-icons/ai';
import { FILTER, MODALS, ORDER } from 'configs';
import { useApp } from 'providers/app';

const MoreButton = (props: MoreButtonProps) => {
  const { colors } = useTheme();

  const { presentModal } = useApp();

  const ref = React.useRef();

  const [show, setShow] = useToggle(false);

  useClickOutside(ref, () => setShow(false));

  // selects
  const toggleSelect = () => {
    props.onToggleSelect();
    setShow(false);
  };

  // filters
  const toggleFilter = (filter: string) => {
    props.onClickFilter(filter);
    setShow(false);
  };

  // settings
  const pushSettings = () => {
    setShow(false);
    presentModal({
      modalKey: MODALS.SETTINGS,
    });
  };

  return (
    <div ref={ref}>
      <CgMoreO
        size={20}
        color={props.color}
        className={`cursor-pointer ${props.className || ''}`}
        style={{ ...props?.style }}
        onClick={() => setShow()}
      />
      <Content
        backgroundColor={colors.card}
        shadowColor={`${colors.text}0F`}
        isActive={show ? '1' : '0'}
        className="mt-2 d-flex flex-column"
      >
        {show && (
          <>
            <MenuItem
              indicatorColor={colors.second}
              borderBottom={`2px solid ${colors.text}1A`}
              hoverColor={colors.text}
              onClick={toggleSelect}
            >
              {props?.selecting && <div className="indicator" />}
              <Text color={colors.text}>
                {props?.selecting ? 'Unselect' : 'Select'}
              </Text>
              <Checkbox color={colors.text} />
            </MenuItem>
            <MenuItem
              hoverColor={colors.text}
              indicatorColor={colors.second}
              onClick={() => toggleFilter(FILTER.NAME)}
              borderBottom={`1px solid ${colors.text}1A`}
            >
              {props?.activeFilter === FILTER.NAME && (
                <div className="indicator" />
              )}
              <Text color={colors.text}>Name</Text>
              <BsFilter
                color={colors.text}
                transform={`rotate(${
                  props?.activeFilter === FILTER.NAME &&
                  props.activeOrder === ORDER.ASC
                    ? 180
                    : 0
                })`}
              />
            </MenuItem>
            <MenuItem
              hoverColor={colors.text}
              indicatorColor={colors.second}
              onClick={() => toggleFilter(FILTER.DATE)}
              borderBottom={`1px solid ${colors.text}1A`}
            >
              {props?.activeFilter === FILTER.DATE && (
                <div className="indicator" />
              )}
              <Text color={colors.text}>Date</Text>
              <BsFilter
                color={colors.text}
                transform={`rotate(${
                  props?.activeFilter === FILTER.DATE &&
                  props.activeOrder === ORDER.ASC
                    ? 180
                    : 0
                })`}
              />
            </MenuItem>
            <MenuItem
              hoverColor={colors.text}
              indicatorColor={colors.second}
              onClick={() => toggleFilter(FILTER.SIZE)}
              borderBottom={`2px solid ${colors.text}1A`}
            >
              {props?.activeFilter === FILTER.SIZE && (
                <div className="indicator" />
              )}
              <Text color={colors.text}>Size</Text>
              <BsFilter
                color={colors.text}
                transform={`rotate(${
                  props?.activeFilter === FILTER.SIZE &&
                  props.activeOrder === ORDER.ASC
                    ? 180
                    : 0
                })`}
              />
            </MenuItem>
            <MenuItem hoverColor={colors.text} onClick={pushSettings}>
              <Text color={colors.text}>Settings</Text>
              <AiOutlineSetting color={colors.text} />
            </MenuItem>
          </>
        )}
      </Content>
    </div>
  );
};

export default MoreButton;

const MenuItem = styled.div`
  height: 45px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px 0 20px;
  position: relative;
  cursor: pointer;
  border-bottom: ${({ borderBottom }) => borderBottom || '0px solid #0000'};
  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || '#000000'}0d;
  }
  .indicator {
    height: 5px;
    width: 5px;
    border-radius: 50%;
    background-color: ${({ indicatorColor }) => indicatorColor || 'black'};
    position: absolute;
    left: 7px;
  }
`;

const Content = styled.div`
  background-color: ${({ backgroundColor }) => backgroundColor || 'white'};
  boxshadow: 2px 4px 10px ${({ shadowColor }) => shadowColor || 'black'};
  width: ${({ isActive }) => (isActive === '1' ? '180px' : '100px')};
  height: ${({ isActive }) => (isActive === '1' ? '225px' : '150px')};
  position: absolute;
  z-index: 100;
  border-radius: 15px;
  overflow: hidden;
  padding: 0;
  opacity: ${({ isActive }) => isActive || '0'};
  transition: height 0.05s linear, width 0.05s linear, opacity 0.15s ease-out;
`;
