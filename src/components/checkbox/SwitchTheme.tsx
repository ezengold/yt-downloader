import React from 'react';
import { SwithThemeProps } from 'types';
import { View } from 'components';
import { BiSun } from 'react-icons/bi';
import { BsMoonStars } from 'react-icons/bs';
import { AppFonts, DARK_THEME, LIGHT_THEME } from 'providers/theme';

const SwitchTheme = (props: SwithThemeProps) => {
  return (
    <View
      width={props?.width}
      height={props?.height}
      radius={props?.radius}
      className="d-flex align-items-center justify-content-between cursor-pointer"
      style={{
        transition: 'all 0.3s linear',
        overflow: 'hidden',
        border: `1px solid ${props.color}`,
        ...props.style,
      }}
    >
      <View
        className="d-flex align-items-center justify-content-start px-3 w-50 h-100"
        font={AppFonts.BOLD}
        background={props?.scheme === LIGHT_THEME ? props.color : 'transparent'}
        color={props?.scheme === LIGHT_THEME ? 'white' : props.color}
        onClick={() => props.onChange(LIGHT_THEME)}
      >
        <BiSun size={20} className="me-2" />
        Light
      </View>
      <View
        className="d-flex align-items-center justify-content-end px-3 w-50 h-100"
        font={AppFonts.BOLD}
        background={props?.scheme === DARK_THEME ? props.color : 'transparent'}
        color={props?.scheme === DARK_THEME ? 'white' : props.color}
        onClick={() => props.onChange(DARK_THEME)}
      >
        Dark
        <BsMoonStars size={20} className="ms-2" />
      </View>
    </View>
  );
};

SwitchTheme.defaultProps = {
  onChange: () => console.log('Attach an onChange function to [SwitchTheme]'),
  scheme: 'light',
  className: '',
  style: {},
  color: 'black',
  width: '200px',
  height: '40px',
  radius: '5px',
};

export default SwitchTheme;
