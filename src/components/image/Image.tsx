import React from 'react';
import { useTheme } from 'providers/theme';
import { ImageProps } from 'types';
import _ from 'lodash';

const Image = (props: ImageProps) => {
  const { colors } = useTheme();

  return (
    <img
      src={props.src}
      alt={props.alt || ''}
      style={{
        backgroundColor: props.background || colors.card || 'transparent',
        width: props.width || undefined,
        height: props.height || undefined,
        border: props.border || undefined,
        boxShadow: props.shadow || undefined,
        objectFit: props.resizeMode || undefined,
        borderRadius: props.radius || undefined,
        ...props.style,
      }}
      {..._.omit(props, [
        'src',
        'alt',
        'background',
        'width',
        'height',
        'border',
        'shadow',
        'resizeMode',
        'radius',
        'style',
      ])}
    />
  );
};

export default Image;
