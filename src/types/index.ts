import React from 'react';

export interface ThemeType {
  colors: {
    principal: string;
    second: string;
    yellow: string;
    red: string;
    green: string;
    card: string;
    background: string;
    text: string;
  };
  scheme: 'light' | 'dark';
  toggleScheme: (toScheme?: string) => void;
}

export interface TextProps {
  color?: string;
  size?: number | string;
  font?: string;
  height?: string | number;
  width?: string | number;
  className?: string;
  style?: object;
  children?: React.ReactNode;
}

export interface ViewProps {
  background?: string;
  color?: string;
  font?: string;
  height?: string | number;
  width?: string | number;
  border?: string;
  shadow?: string;
  radius?: string;
  className?: string;
  style?: object;
  children?: React.ReactNode;
}

export interface ImageProps {
  background?: string;
  height?: string | number;
  width?: string | number;
  border?: string;
  shadow?: string;
  resizeMode?: 'contain' | 'cover' | 'fill' | 'none';
  radius?: string;
  style?: object;
  className?: string;
  src: string | undefined;
  alt?: string | undefined;
}

export interface ProgressBarProps {
  /**
   * Between 0 - 100
   */
  progress: number;
  background?: string;
  foreground?: string;
  height?: string | number;
  width?: string | number;
  radius?: string;
  border?: string;
  className?: string;
  style?: object;
}

export interface InputProps {
  color?: string;
  background?: string;
  size?: number | string;
  font?: string;
  className?: string;
  style?: object;
  containerClassName?: string;
  containerStyle?: object;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  value?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  onChange?: (event: any) => void;
}

export interface SizeUnit {
  title: string;

  /**
   * ratio * item size gives equivalent in default SizeUnit.
   * The default SizeUnit has a ratio of 1
   */
  ratio: number;
}

export interface ItemSize {
  value: number;
  unit: SizeUnit;
}

export type SpeedUnit = SizeUnit;
export type ItemSpeed = ItemSize;

export interface SubItem {
  id: string;
  title: string;
  img?: string | undefined;
  size?: ItemSize;
  currentSize?: ItemSize;
  speed?: ItemSpeed;
  status?: string;
  error?: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  img?: string | undefined;
  totalSize?: ItemSize;
  currentSize?: ItemSize;
  currentSpeed?: ItemSpeed;
  addedAt?: string;
  status?: string;
  items: SubItem[];
  error?: string;
}

export interface ItemProps {
  item: DownloadItem;
  isActive?: boolean;
  className?: string;
  style?: object;
  onClick?: () => void;
}
