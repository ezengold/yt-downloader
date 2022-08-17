import React from 'react';
import { View, Text, SwithTheme, ColorInput } from 'components';
import { AppFonts, useTheme } from 'providers/theme';

const SetTheme = () => {
  const { colors, scheme, toggleScheme, updateColor, resetDefaults } =
    useTheme();

  const handleUpdateTheme = (key = '', value = '') => {
    updateColor(scheme, key, value);
  };

  return (
    <View className="fadeInAnim d-flex flex-column w-100">
      <View
        className="d-flex align-items-center justify-content-between w-100 mt-2"
        style={{
          paddingBottom: '30px',
          borderBottom: `0.5px solid ${colors?.text}4D`,
        }}
      >
        <Text>App color scheme</Text>
        <SwithTheme
          color={colors.principal}
          scheme={scheme}
          onChange={() => toggleScheme()}
        />
      </View>
      <Text className="my-4">Customize app colors</Text>
      <ColorInput
        color={colors.principal}
        label="Main color"
        className="mb-3"
        onChange={(color) => handleUpdateTheme('principal', color)}
      />
      <ColorInput
        color={colors.second}
        label="Secondary color"
        className="mb-3"
        onChange={(color) => handleUpdateTheme('second', color)}
      />
      <ColorInput
        color={colors.yellow}
        label="Yellow color"
        className="mb-3"
        onChange={(color) => handleUpdateTheme('yellow', color)}
      />
      <ColorInput
        color={colors.red}
        label="Red color"
        className="mb-3"
        onChange={(color) => handleUpdateTheme('red', color)}
      />
      <div
        style={{
          width: '100%',
          paddingBottom: '50px',
          borderBottom: `0.5px solid ${colors?.text}4D`,
        }}
      />
      <Text
        className="mt-4 cursor-pointer text-decoration-underline"
        color={colors.principal}
        font={AppFonts.SEMIBOLD}
        onClick={() => resetDefaults()}
      >
        Reset to default theme settings
      </Text>
    </View>
  );
};

export default SetTheme;
