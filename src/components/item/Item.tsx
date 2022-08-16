import React from 'react';
import { ItemProps } from 'types';
import { ProgressBar, Image, Text, Checkbox } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import styled from 'styled-components';
import { CANCELED_STATUS, COMPLETED_STATUS, RUNNING_STATUS } from 'configs';
import { BsCheckAll } from 'react-icons/bs';
import { FiAlertTriangle } from 'react-icons/fi';

const Item = (props: ItemProps) => {
  const { colors } = useTheme();

  return (
    <Wrapper
      className={`d-flex align-items-center ${props.isActive ? 'active' : ''}`}
      isSelectable={props.isSelectable ? '1' : '0'}
      onClick={props.onClick}
      hoverColor={colors.second}
    >
      <div className="selectable">
        <Checkbox size={16} color={colors.principal} />
      </div>
      <Image
        src={props.item.img}
        height="60px"
        width="60px"
        resizeMode="cover"
        radius="10px"
        style={{ marginRight: '15px' }}
      />
      <div className="content">
        <Text
          font={AppFonts.SEMIBOLD}
          className="white-space-nowrap overflow-hidden text-tail w-90"
        >
          {props.item?.title || ''}
        </Text>
        {props.item?.status === RUNNING_STATUS && (
          <ProgressBar
            progress={30}
            className="my-3"
            radius="5px"
            foreground={colors.principal}
            background={colors.background}
          />
        )}
        {props.item?.status === COMPLETED_STATUS && (
          <Text color={colors.green} size={13} className="my-2">
            {props.item?.status}
            <BsCheckAll className="ms-2" size={15} />
          </Text>
        )}
        {props.item?.status === CANCELED_STATUS && (
          <Text color={colors.red} size={13} className="my-2">
            <FiAlertTriangle className="me-2" size={15} />
            {props.item?.error}
          </Text>
        )}
        <div className="w-100 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Text size={12} className="me-2">
              Size :{' '}
            </Text>
            <Text color={colors.principal} size={12} font={AppFonts.BOLD}>
              {props.item?.totalSize?.value}{' '}
              {props.item?.totalSize?.unit?.title}
            </Text>
          </div>
          <Text size={12}>Added at : {props.item?.addedAt}</Text>
        </div>
      </div>
    </Wrapper>
  );
};

export default Item;

const Wrapper = styled.div`
  cursor: pointer;
  width: 100%;
  border-radius: 10px;
  padding: 15px;
  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || '#000000'}0D;
  }
  &.active {
    background-color: ${({ hoverColor }) =>
      hoverColor || '#000000'}26 !important;
  }
  .content {
    display: flex;
    flex-direction: column;
    width: ${({ isSelectable }) =>
      isSelectable === '1' ? 'calc(100% - 100px)' : 'calc(100% - 80px)'};
    transition: width 0.1s ease-in-out;
  }
  .selectable {
    margin-right: ${({ isSelectable }) =>
      isSelectable === '1' ? '15px' : '0px'};
    width: ${({ isSelectable }) => (isSelectable === '1' ? '16px' : '0px')};
    opacity: ${({ isSelectable }) => (isSelectable === '1' ? '1' : '0')};
    transition: all 0.1s ease-in-out;
  }
`;
