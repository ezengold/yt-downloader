import React from 'react';
import { InputProps } from 'types';
import { AppFonts, useTheme } from 'providers/theme';
import _ from 'lodash';

const Input = (props: InputProps) => {
  const { colors } = useTheme();

  return (
    <div
      className={`ezen-input-wrapper d-flex align-items-center ${
        props.containerClassName || ''
      }`}
      style={{
        border: `1px solid ${colors.text}0D`,
        borderRadius: '5px',
        backgroundColor: props?.background || colors.background,
        ...props.containerStyle,
      }}
    >
      {props.iconLeft}
      <input
        className={`px-2 ${props.className || ''}`}
        style={{
          flex: 1,
          color: props.color || colors.text,
          fontSize: props.size || undefined,
          fontFamily: props.font || AppFonts.REGULAR,
          ...props.style,
        }}
        type={props.value}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        {..._.omit(props, [
          'containerClassName',
          'containerStyle',
          'background',
          'iconLeft',
          'iconRight',
          'className',
          'color',
          'size',
          'font',
          'style',
          'value',
          'name',
          'placeholder',
          'onChange',
        ])}
      />
      {props.iconRight}
    </div>
  );
};

export default Input;
