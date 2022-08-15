import React from 'react';
import { useTheme, AppFonts } from 'providers/theme';
import { ViewProps } from 'types';
import _ from 'lodash';

const View = (props: ViewProps) => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        color: props.color || colors?.text,
        backgroundColor: props.background || 'transparent',
        fontFamily: props.font || AppFonts.REGULAR,
        width: props.width || undefined,
        height: props.height || undefined,
        border: props.border || undefined,
        boxShadow: props.shadow || undefined,
        borderRadius: props.radius || undefined,
        ...props.style,
      }}
      {..._.omit(props, [
        'color',
        'size',
        'font',
        'width',
        'height',
        'border',
        'shadow',
        'radius',
        'style',
      ])}
    >
      {props.children}
    </div>
  );
};

export default View;
