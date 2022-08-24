import React, { useState } from 'react';
import { Checkbox, Image, ProgressBar, Text, View } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import { useApp } from 'providers/app';
import { useStore } from 'providers/store';
import styled from 'styled-components';
import { IoTrashOutline } from 'react-icons/io5';
import { BsPlayFill, BsStopFill } from 'react-icons/bs';
import {
  CANCELED_STATUS,
  COMPLETED_STATUS,
  MODALS,
  PENDING_STATUS,
  RUNNING_STATUS,
} from 'configs';
import { prefeeredSizeOf, prefeeredSpeedOf } from 'helpers';

const ContentFolder = ({ overlayed }) => {
  const { colors } = useTheme();

  const { presentModal } = useApp();

  const { currentItem, performDownload, stopDownload, deleteItemVideos } =
    useStore();

  const startDownload = () => {
    if ([PENDING_STATUS, CANCELED_STATUS].includes(currentItem?.status)) {
      performDownload(currentItem?.id);
    }
  };

  const cancelDownload = () => {
    if (currentItem?.status === RUNNING_STATUS) {
      stopDownload(currentItem?.id);
    }
  };

  /**
   * Handle selecting items for deletion
   */
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectItem = (itemId = '', status = false) => {
    if (status) {
      // status is true if in selected id array
      setSelectedIds((old) => old.filter((id) => id !== itemId));
    } else {
      setSelectedIds((old) => [...old, itemId]);
    }
  };

  const handleToogleSelectAll = (status = false) => {
    if (status) {
      // status is true if next move is to select all
      setSelectedIds(currentItem?.items.map((el) => el?.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteItems = () => {
    presentModal({
      modalKey: MODALS.CONFIRM_DELETE,
      modalProps: {
        title: 'Warning !',
        message: 'Do you really want to delete the selected items ?',
      },
      onHide: (status) => {
        deleteItemVideos(currentItem?.id, selectedIds);
      },
    });
  };

  return (
    <View
      className={`ezen-content ${
        overlayed ? 'overlayed' : ''
      } d-flex flex-column position-relative`}
    >
      <Image
        src={currentItem?.img}
        height="150px"
        width="150px"
        resizeMode="cover"
        radius="15px"
        shadow={`0px 0px 14px ${colors.text}1A`}
        border={`5px solid ${colors.card}`}
        style={{ position: 'absolute', top: 0, left: '40px' }}
      />
      <View
        background={colors.card}
        radius="10px"
        className="w-100 p-4 d-flex flex-column"
        style={{ marginTop: '75px', height: 'calc(100% - 75px)' }}
      >
        <div
          style={{ marginLeft: '200px', width: 'calc(100% - 200px)' }}
          className="d-flex align-items-start justify-content-between mb-3"
        >
          <div className="w-75 d-flex flex-column">
            <Text
              size="15px"
              font={AppFonts.MEDIUM}
              className="white-space-nowrap overflow-hidden text-tail w-100"
            >
              {currentItem?.title}
            </Text>
            <View className="w-100 d-flex flex-wrap align-items-center mt-2">
              <Text
                color={colors.yellow}
                font={AppFonts.MEDIUM}
                className="me-5"
              >
                {currentItem?.items?.length} videos
              </Text>
              <Text>Saved at : {currentItem?.location || '-'}</Text>
            </View>
            <Text size="25px" font={AppFonts.SEMIBOLD} className="mt-2">
              {prefeeredSpeedOf(currentItem?.currentSpeed)?.value?.toFixed(0)}{' '}
              {prefeeredSpeedOf(currentItem?.currentSpeed)?.unit?.title}
            </Text>
          </div>
          <div className="d-flex align-items-center justify-content-end">
            <BsStopFill
              size={30}
              opacity={currentItem?.status === RUNNING_STATUS ? 1 : 0.5}
              color={`${colors.principal}`}
              className="me-4 cursor-pointer"
              onClick={cancelDownload}
            />
            <BsPlayFill
              size={30}
              color={`${colors.principal}`}
              opacity={
                [PENDING_STATUS, CANCELED_STATUS].includes(currentItem?.status)
                  ? 1
                  : 0.5
              }
              className="me-4 cursor-pointer"
              onClick={startDownload}
            />
            <IoTrashOutline
              size={20}
              color={`${colors.red}`}
              className="cursor-pointer"
              opacity={selectedIds.length > 0 ? 1 : 0.5}
              onClick={selectedIds.length > 0 ? handleDeleteItems : () => {}}
            />
          </div>
        </div>
        <TableWrapper
          headerColor={`${colors.principal}`}
          rowsColor={`${colors.second}0D`}
          indicatorForeground={colors.text}
          indicatorBackground={colors.background}
          className="px-2"
        >
          <table>
            <thead>
              <tr>
                {currentItem?.status !== RUNNING_STATUS && (
                  <th
                    style={{
                      width: '50px',
                      borderRadius: '5px 0 0 5px',
                    }}
                  >
                    <Checkbox
                      size={15}
                      color="white"
                      checked={selectedIds.length === currentItem?.items.length}
                      onChange={handleToogleSelectAll}
                    />
                  </th>
                )}
                <th
                  style={
                    currentItem?.status === RUNNING_STATUS
                      ? { borderRadius: '5px 0 0 5px' }
                      : {}
                  }
                >
                  Insight
                </th>
                <th className="text-start">Name</th>
                <th className="text-start">Status</th>
                <th
                  style={{
                    borderRadius: '0 5px 5px 0',
                  }}
                >
                  Size
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItem?.items?.map((item) => {
                const isChecked = selectedIds.includes(item?.id);

                return (
                  <tr key={item?.id}>
                    {currentItem?.status !== RUNNING_STATUS && (
                      <td
                        style={{
                          width: '50px',
                          borderRadius: '5px 0 0 5px',
                        }}
                      >
                        <Checkbox
                          size={15}
                          color={colors.principal}
                          checked={isChecked}
                          onChange={() => handleSelectItem(item?.id, isChecked)}
                        />
                      </td>
                    )}
                    <td
                      style={
                        currentItem?.status === RUNNING_STATUS
                          ? { borderRadius: '5px 0 0 5px' }
                          : {}
                      }
                    >
                      <Image
                        src={item?.img}
                        height="40px"
                        width="40px"
                        radius="5px"
                        resizeMode="cover"
                      />
                    </td>
                    <td className="text-start">{item?.title}</td>
                    <td className="text-start">
                      {item?.status === RUNNING_STATUS ? (
                        <ProgressBar
                          progress={
                            item?.currentSize?.value <= item?.size?.value
                              ? (
                                  (item?.currentSize?.value * 100) /
                                  item?.size?.value
                                ).toFixed(0)
                              : 100
                          }
                          width="150px"
                          background="transparent"
                          foreground={colors.principal}
                          radius="5px"
                        />
                      ) : item?.status === CANCELED_STATUS ? (
                        <Text color={colors.red}>{item?.error}</Text>
                      ) : (
                        <Text
                          color={
                            item?.status === PENDING_STATUS
                              ? colors.yellow
                              : item?.status === COMPLETED_STATUS
                              ? colors.green
                              : colors.text
                          }
                        >
                          {item?.status}
                        </Text>
                      )}
                    </td>
                    <td
                      style={{
                        borderRadius: '0 5px 5px 0',
                      }}
                    >{`${prefeeredSizeOf(item?.size)?.value?.toFixed(2)} ${
                      prefeeredSizeOf(item?.size)?.unit?.title
                    }`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableWrapper>
      </View>
    </View>
  );
};

const TableWrapper = styled.div`
  width: 100%;
  height: calc(100% - 110px);
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
  table {
    width: 100%;
    border: 0px solid #0000;
    border-collapse: separate;
    border-spacing: 0px 15px;
    tr {
      background-color: ${({ rowsColor }) => rowsColor || '#0002'};
    }
    th {
      border: 0px solid #0000;
      padding: 15px 5px;
      background-color: ${({ headerColor }) => headerColor || '#0004'};
      padding-bottom: 1em !important;
      font-family: ${AppFonts.BOLD};
      color: white;
      text-align: center;
      font-size: 90%;
    }
    td {
      padding: 15px 5px;
      border: 0px solid #0000;
      font-family: ${AppFonts.REGULAR};
      text-align: center;
      font-size: 90%;
    }
  }
`;

export default ContentFolder;
