import React, { useEffect, useState } from 'react';
import { Channels } from 'models';
import { ColorSchemeStore, ThemeType } from 'types';
import { DarkColors, DARK_THEME, LightColors, LIGHT_THEME } from './Colors';

const ThemeContext = React.createContext<ThemeType>({});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [DARK_COLORS, setDARK_COLORS] = useState(DarkColors);

  const [LIGHT_COLORS, setLIGHT_COLORS] = useState(LightColors);

  const [scheme, setScheme] = useState(LIGHT_THEME);

  const [currentTheme, setCurrentTheme] = useState(LIGHT_COLORS);

  const toggleScheme = (toScheme: string | undefined) => {
    if (toScheme) {
      setCurrentTheme(toScheme === DARK_THEME ? DARK_COLORS : LIGHT_COLORS);
      setScheme(toScheme);
      handleSchemePreferences(toScheme, LIGHT_COLORS, DARK_COLORS);
    } else {
      setCurrentTheme(scheme === DARK_THEME ? LIGHT_COLORS : DARK_COLORS);
      setScheme((old) => (old === DARK_THEME ? LIGHT_THEME : DARK_THEME));
      handleSchemePreferences(
        scheme === DARK_THEME ? LIGHT_THEME : DARK_THEME,
        LIGHT_COLORS,
        DARK_COLORS
      );
    }
  };

  const resetToDefault = () => {
    setDARK_COLORS(DarkColors);
    setLIGHT_COLORS(LightColors);
    setCurrentTheme(scheme === LIGHT_THEME ? LightColors : DarkColors);
    handleSchemePreferences(scheme, LightColors, DarkColors);
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
        handleSchemePreferences(scheme, updated, DARK_COLORS);
      }
    } else if (themeScheme === DARK_THEME) {
      if (!!colorName && !!colorValue) {
        const updated = {
          ...DARK_COLORS,
          [colorName]: colorValue,
        };
        setDARK_COLORS(updated);
        setCurrentTheme(scheme === LIGHT_THEME ? LIGHT_COLORS : updated);
        handleSchemePreferences(scheme, LIGHT_COLORS, updated);
      }
    }
  };

  const handleFetchPreferences = () => {
    window.electron.ipcRenderer.sendMessage(Channels.GET_COLOR_SCHEME, []);
  };

  const handleSchemePreferences = (schemeType, lightColors, darkColors) => {
    window.electron.ipcRenderer.sendMessage(Channels.SAVE_COLOR_SCHEME, [
      JSON.stringify({
        scheme: schemeType,
        lightColors,
        darkColors,
      }),
    ]);
  };

  useEffect(() => {
    handleFetchPreferences();
    window.electron.ipcRenderer.once(
      Channels.GET_COLOR_SCHEME,
      (colorScheme) => {
        if (colorScheme) {
          const parsedColorScheme = JSON.parse(
            colorScheme as string
          ) as ColorSchemeStore;
          const savedLightColors = {
            ...LIGHT_COLORS,
            ...parsedColorScheme?.lightColors,
          };
          const savedDarkColors = {
            ...DARK_COLORS,
            ...parsedColorScheme?.darkColors,
          };
          if (parsedColorScheme?.scheme === DARK_THEME) {
            setScheme(DARK_THEME);
            setCurrentTheme(savedDarkColors);
          } else {
            setScheme(LIGHT_THEME);
            setCurrentTheme(savedLightColors);
          }
          setLIGHT_COLORS(savedLightColors);
          setDARK_COLORS(savedDarkColors);
        }
      }
    );
  }, []);

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
