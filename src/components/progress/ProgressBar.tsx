import React from 'react';
import { useTheme } from 'providers/theme';
import { ProgressBarProps } from 'types';
import _ from 'lodash';

const ProgressBar = (props: ProgressBarProps) => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        backgroundColor:
          `${props.background}26` || `${colors.principal}26` || 'transparent',
        width: props.width || '100%',
        height: props.height || '10px',
        borderRadius: props.radius || 0,
        ...props.style,
      }}
      {..._.omit(props, [
        'background',
        'foreground',
        'width',
        'height',
        'radius',
        'style',
        'className',
      ])}
      className={`d-flex align-items-center ${props.className || ''}`}
    >
      <div
        style={{
          height: '100%',
          width: `${
            props.progress >= 0 && props.progress <= 100
              ? props.progress
              : props.progress < 0
              ? 0
              : 100
          }%`,
          backgroundColor: props.foreground || colors.principal,
          borderRadius: props.radius || 0,
          transition: 'all 0.2s linear',
        }}
      />
    </div>
  );
};

export default ProgressBar;
