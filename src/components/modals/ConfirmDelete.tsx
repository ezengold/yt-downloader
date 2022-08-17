import React from 'react';
import { View, Text } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import { useApp } from 'providers/app';

const ConfirmDelete = (props: { title: string; message: string }) => {
  const { colors } = useTheme();

  const { closeModal } = useApp();

  return (
    <View
      className="ezen-modal p-4 rounded-15"
      width="450px"
      background={colors.card}
    >
      <View
        width="100%"
        height="45px"
        radius="5px"
        background={`${colors.principal}33`}
        className="d-flex align-items-center justify-content-center"
      >
        <Text color={colors.principal} font={AppFonts.BOLD}>
          {props?.title}
        </Text>
      </View>
      <Text className="text-center p-5">{props?.message}</Text>
      <View className="w-100 d-flex align-items-center justify-content-evenly">
        <View
          width="100px"
          radius="4px"
          className="ezen-btn"
          font={AppFonts.SEMIBOLD}
          background={colors.background}
          onClick={() => closeModal(false)}
        >
          Cancel
        </View>
        <View
          width="100px"
          radius="4px"
          className="ezen-btn"
          font={AppFonts.SEMIBOLD}
          color="white"
          background={colors.principal}
          onClick={() => closeModal(true)}
        >
          Proceed
        </View>
      </View>
    </View>
  );
};

export default ConfirmDelete;
