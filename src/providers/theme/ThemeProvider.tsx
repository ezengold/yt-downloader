import React, { useState } from 'react';
import { ThemeType } from 'types';
import { DarkColors, DARK_THEME, LightColors, LIGHT_THEME } from './Colors';

const ThemeContext = React.createContext<ThemeType>({});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // const [loading, setLoading] = useState(false);

  const [DARK_COLORS, setDARK_COLORS] = useState(DarkColors);

  const [LIGHT_COLORS, setLIGHT_COLORS] = useState(LightColors);

  const [scheme, setScheme] = useState(LIGHT_THEME);

  const [currentTheme, setCurrentTheme] = useState(LIGHT_COLORS);

  const toggleScheme = (toScheme: string | undefined) => {
    if (toScheme) {
      setCurrentTheme(toScheme === DARK_THEME ? DARK_COLORS : LIGHT_COLORS);
      setScheme(toScheme);
    } else {
      setCurrentTheme(scheme === DARK_THEME ? LIGHT_COLORS : DARK_COLORS);
      setScheme((old) => (old === DARK_THEME ? LIGHT_THEME : DARK_THEME));
    }
  };

  const resetToDefault = () => {
    setDARK_COLORS(DarkColors);
    setLIGHT_COLORS(LightColors);
    setCurrentTheme(scheme === LIGHT_THEME ? LightColors : DarkColors);
  };

  const updateColor = (themeScheme = '', colorName = '', colorValue = '') => {
    if (themeScheme === LIGHT_THEME) {
      if (!!colorName && !!colorValue) {
        const updated = {
          ...LIGHT_COLORS,
          [colorName]: colorValue,
        };
        setLIGHT_COLORS(updated);
        setCurrentTheme(scheme === LIGHT_THEME ? updated : DARK_COLORS);
      }
    } else if (themeScheme === DARK_THEME) {
      if (!!colorName && !!colorValue) {
        const updated = {
          ...DARK_COLORS,
          [colorName]: colorValue,
        };
        setDARK_COLORS(updated);
        setCurrentTheme(scheme === LIGHT_THEME ? LIGHT_COLORS : updated);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: currentTheme,
        scheme,
        toggleScheme,
        resetDefaults: resetToDefault,
        updateColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => React.useContext(ThemeContext);

export { useTheme, ThemeProvider, ThemeContext };
