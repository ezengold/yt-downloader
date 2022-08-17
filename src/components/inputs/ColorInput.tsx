import React from 'react';
import { ColorInputProps } from 'types';
import { useTheme } from 'providers/theme';
import { Text } from 'components';
import styled from 'styled-components';
import { GiClick } from 'react-icons/gi';
import { useClickOutside, useToggle } from 'hooks';
import { TwitterPicker } from 'react-color';

const ColorInput = (props: ColorInputProps) => {
  const { colors } = useTheme();

  const ref = React.useRef();

  const [show, setShow] = useToggle(false);

  useClickOutside(ref, () => setShow(false));

  return (
    <Wrapper
      ref={ref}
      mainColor={props?.color || ''}
      style={{
        width: props?.width,
        height: props?.height,
        borderRadius: props?.radius,
        position: 'relative',
      }}
      className={props.className || ''}
    >
      <Text className="name" color={colors.text}>
        {props?.label || ''}
      </Text>
      <Text className="value text-uppercase" color={colors.text}>
        {props?.color || ''}
      </Text>
      <div className="picker" onClick={() => setShow()}>
        <GiClick size={18} color="white" />
      </div>
      {show && (
        <Content
          backgroundColor={colors.card}
          textColor={colors.text}
          shadowColor={`${colors.text}0F`}
          isActive={show ? '1' : '0'}
          className="mt-2 d-flex align-items-center justify-content-center"
        >
          <TwitterPicker
            className="picker"
            color={props?.color}
            onChange={(color) => props.onChange(color?.hex)}
            onChangeComplete={(color) => props.onChange(color?.hex)}
          />
        </Content>
      )}
    </Wrapper>
  );
};

export default ColorInput;

const Wrapper = styled.div`
  border: 1px solid ${({ mainColor }) => mainColor || '#0000'};
  border-radius: 5px;
  width: 500px;
  height: 35px;
  display: flex;
  align-items: center;
  .picker {
    width: 60px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ mainColor }) => mainColor || '#0000'};
    cursor: pointer;
  }
  .value {
    width: 140px;
    height: 100%;
    display: flex;
    align-items: center;
    border-left: 1px solid ${({ mainColor }) => mainColor || '#0000'};
    padding: 0 10px;
  }
  .name {
    width: calc(100% - 200px);
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 10px;
  }
`;

const Content = styled.div`
  width: ${({ isActive }) => (isActive === '1' ? '278px' : '250px')};
  height: ${({ isActive }) => (isActive === '1' ? '96px' : '80px')};
  position: absolute;
  right: -216px;
  top: 35px;
  z-index: 5000;
  border-radius: 8px;
  overflow: hidden;
  background-color: transparent;
  opacity: ${({ isActive }) => isActive || '0'};
  transition: height 0.05s linear, width 0.05s linear, opacity 0.05s ease-out;
  box-shadow: 0px 1px 4px ${({ textColor }) => textColor || '#0000'}4D;
  .picker {
    background-color: ${({ backgroundColor }) =>
      backgroundColor || '#0000'} !important;
    box-shadow: none !important;
    border-radius: 0px !important;
    position: unset !important;
  }
  input {
    height: 30px !important;
    background: ${({ backgroundColor }) => backgroundColor || '#0000'};
    color: ${({ textColor }) => textColor || '#0000'} !important;
  }
`;
