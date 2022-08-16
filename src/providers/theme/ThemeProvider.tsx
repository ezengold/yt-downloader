import React, { useState } from 'react';
import { ThemeType } from 'types';
import { DarkColors, DARK_THEME, LightColors, LIGHT_THEME } from './Colors';

const ThemeContext = React.createContext<ThemeType>({});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // const [loading, setLoading] = useState(false);

  const [scheme, setScheme] = useState(DARK_THEME);

  const [currentTheme, setCurrentTheme] = useState(DarkColors);

  const toggleScheme = (toScheme: string | undefined) => {
    if (toScheme) {
      setCurrentTheme(toScheme === DARK_THEME ? DarkColors : LightColors);
      setScheme(toScheme);
    } else {
      setCurrentTheme(scheme === DARK_THEME ? LightColors : DarkColors);
      setScheme((old) => (old === DARK_THEME ? LIGHT_THEME : DARK_THEME));
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: currentTheme,
        scheme,
        toggleScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => React.useContext(ThemeContext);

export { useTheme, ThemeProvider, ThemeContext };
