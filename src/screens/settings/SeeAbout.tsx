import React from 'react';
import { Image, Text, View } from 'components';
import { AppFonts, useTheme } from 'providers/theme';
import AppIcon from '../../../assets/icon.png';

const SeeAbout = () => {
  const { colors } = useTheme();

  return (
    <View className="fadeInAnim d-flex flex-column align-items-center justify-content-center pt-4">
      <Image
        src={AppIcon}
        height="150px"
        width="150px"
        radius="30px"
        shadow={`0px 0px 16px ${colors.text}1A`}
        className="mt-5"
      />
      <Text font={AppFonts.BOLD} size="18px" className="text-center mt-5">
        #yt-dlp #electron #react
      </Text>
      <Text
        font={AppFonts.SEMIBOLD}
        size="15px"
        className="text-center mt-5 mb-4"
      >
        By ezen, © 2022
      </Text>
      <Text size="15px" className="text-center">
        All rights reserved
      </Text>
    </View>
  );
};

export default SeeAbout;
