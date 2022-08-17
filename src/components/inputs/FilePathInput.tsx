import React from 'react';
import { FilePathInputProps } from 'types';
import { useTheme } from 'providers/theme';
import { Text } from 'components';
import styled from 'styled-components';
import { BsFolderFill } from 'react-icons/bs';

const FilePathInput = (props: FilePathInputProps) => {
  const { colors } = useTheme();

  return (
    <Wrapper
      mainColor={props?.color || colors?.principal}
      style={{
        width: props?.width,
        height: props?.height,
        borderRadius: props?.radius,
      }}
      className={props.className || ''}
    >
      <div className="icon">
        <BsFolderFill size={20} color={props?.color || colors.principal} />
      </div>
      <Text
        className="input"
        color={props.path ? colors.text : `${colors.text}77`}
      >
        {props?.path || props?.placeholder || ''}
      </Text>
    </Wrapper>
  );
};

export default FilePathInput;

const Wrapper = styled.div`
  border: 1px solid ${({ mainColor }) => mainColor || '#0000'};
  overflow: hidden;
  border-radius: 5px;
  width: 200px;
  height: 45px;
  display: flex;
  align-items: center;
  .icon {
    width: 45px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid ${({ mainColor }) => mainColor || '#0000'};
    background: ${({ mainColor }) => mainColor || '#0000'}33;
    cursor: pointer;
  }
  .input {
    width: calc(100% - 45px);
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 10px;
  }
`;
