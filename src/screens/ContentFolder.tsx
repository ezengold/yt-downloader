import React from 'react';
import { Checkbox, Image, ProgressBar, Text, View } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import { useApp } from 'providers/app';
import styled from 'styled-components';
import { IoTrashOutline } from 'react-icons/io5';
import { BsPlayFill, BsStopFill } from 'react-icons/bs';
import {
  CANCELED_STATUS,
  COMPLETED_STATUS,
  PENDING_STATUS,
  RUNNING_STATUS,
} from 'configs';

const ContentFolder = ({ overlayed }) => {
  const { colors } = useTheme();

  const { currentItem } = useApp();

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
          className="d-flex align-items-start justify-content-between mb-5"
        >
          <div className="w-75 d-flex flex-column">
            <Text
              size="15px"
              font={AppFonts.MEDIUM}
              className="white-space-nowrap overflow-hidden text-tail w-100"
            >
              {currentItem?.title}
            </Text>
            <Text size="25px" font={AppFonts.SEMIBOLD} className="mt-2">
              {currentItem?.currentSpeed?.value}{' '}
              {currentItem?.currentSpeed?.unit?.title}
            </Text>
          </div>
          <div className="d-flex align-items-center justify-content-end">
            <BsStopFill
              size={30}
              color={`${colors.principal}`}
              className="me-4 cursor-pointer"
            />
            <BsPlayFill
              size={30}
              color={`${colors.principal}`}
              opacity={0.5}
              className="me-4 cursor-pointer"
            />
            <IoTrashOutline
              size={20}
              color={`${colors.red}`}
              className="cursor-pointer"
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
                <th
                  style={{
                    width: '50px',
                    borderRadius: '5px 0 0 5px',
                  }}
                >
                  <Checkbox size={15} color="white" />
                </th>
                <th>Insight</th>
                <th className="text-start">Name</th>
                <th className="text-start">Speed</th>
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
                return (
                  <tr key={item?.id}>
                    <td
                      style={{
                        width: '50px',
                        borderRadius: '5px 0 0 5px',
                      }}
                    >
                      <Checkbox size={15} color={colors.principal} />
                    </td>
                    <td>
                      <Image
                        src={item?.img}
                        height="40px"
                        width="40px"
                        radius="5px"
                        resizeMode="cover"
                      />
                    </td>
                    <td className="text-start">{item?.title}</td>
                    <td className="text-start">{`${item?.speed?.value} ${item?.speed?.unit?.title}`}</td>
                    <td className="text-start">
                      {item?.status === RUNNING_STATUS ? (
                        <ProgressBar
                          progress={20}
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
                    >{`${item?.size?.value} ${item?.size?.unit?.title}`}</td>
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
