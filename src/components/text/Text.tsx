import React from 'react';
import { useTheme, AppFonts } from 'providers/theme';
import { TextProps } from 'types';
import _ from 'lodash';

const Text = (props: TextProps) => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        color: props.color || colors?.text,
        fontSize: props.size || 14,
        fontFamily: props.font || AppFonts.REGULAR,
        width: props.width || undefined,
        height: props.height || undefined,
        ...props.style,
      }}
      {..._.omit(props, ['color', 'size', 'font', 'style', 'width', 'height'])}
    >
      {props.children}
    </div>
  );
};

export default Text;
