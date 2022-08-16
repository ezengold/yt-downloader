import React from 'react';
import { Text, Checkbox } from 'components';
import { CgMoreO } from 'react-icons/cg';
import { MoreButtonProps } from 'types';
import { useTheme } from 'providers/theme';
import styled from 'styled-components';
import { useClickOutside, useToggle } from 'hooks';

const MoreButton = (props: MoreButtonProps) => {
  const { colors } = useTheme();

  const ref = React.useRef();

  const [show, setShow] = useToggle(false);

  useClickOutside(ref, () => setShow(false));

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
        <MenuItem hoverColor={colors.text}>
          <Text color={colors.text}>Select</Text>
          <Checkbox color={colors.text} />
        </MenuItem>
        <MenuItem hoverColor={colors.text}>
          <Text color={colors.text}>Select</Text>
          <Checkbox color={colors.text} />
        </MenuItem>
        <MenuItem hoverColor={colors.text}>
          <Text color={colors.text}>Select</Text>
          <Checkbox color={colors.text} />
        </MenuItem>
        <MenuItem hoverColor={colors.text}>
          <Text color={colors.text}>Select</Text>
          <Checkbox color={colors.text} />
        </MenuItem>
        <MenuItem hoverColor={colors.text}>
          <Text color={colors.text}>Select</Text>
          <Checkbox color={colors.text} />
        </MenuItem>
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
  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || '#000000'}0d;
  }
  .indicator {
    height: 5px;
    width: 5px;
    border-radius: 50%;
    background-color: ${({ indicatorColor }) => indicatorColor || 'black'};
    position: absolute;
    left: 10px;
  }
`;

const Content = styled.div`
  background-color: ${({ backgroundColor }) => backgroundColor || 'white'};
  boxshadow: 2px 4px 10px ${({ shadowColor }) => shadowColor || 'black'};
  width: ${({ isActive }) => (isActive === '1' ? '180px' : '160px')};
  height: ${({ isActive }) => (isActive === '1' ? '225px' : '200px')};
  position: absolute;
  z-index: 100;
  border-radius: 15px;
  overflow: hidden;
  padding: 0;
  opacity: ${({ isActive }) => isActive || '0'};
  transition: height 0.05s linear, width 0.05s linear, opacity 0.05s ease-out;
`;
