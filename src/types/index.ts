import React from 'react';
import { DownloadItem, DownloadSubItem, ItemSize, ItemSpeed } from 'models';

export interface ColorsType {
  principal: string;
  second: string;
  yellow: string;
  red: string;
  green: string;
  card: string;
  background: string;
  text: string;
}

export interface ColorSchemeStore {
  scheme: 'light' | 'dark' | string;
  lightColors: ColorsType;
  darkColors: ColorsType;
}

export interface ThemeType {
  colors: ColorsType;
  scheme: 'light' | 'dark' | string;
  toggleScheme: (toScheme?: string) => void;
  resetDefaults: () => void;
  updateColor: (
    themeScheme: string,
    colorName: string,
    colorValue: string
  ) => void;
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
  onClick?: () => void;
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

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (status: boolean) => void;
  color?: string;
  size?: number;
  className?: string;
  style?: object;
  ActiveIcon?: React.ReactNode;
  InactiveIcon?: React.ReactNode;
}

export interface SwithThemeProps {
  scheme?: string;
  onChange?: (scheme: string) => void;
  color?: string;
  className?: string;
  style?: object;
  height?: string | number;
  width?: string | number;
  radius?: string;
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

export interface FilePathInputProps {
  height?: string | number;
  width?: string | number;
  radius?: string;
  color?: string;
  path?: string;
  placeholder?: string;
  onChange?: (path: string) => void;
  className?: string;
}

export interface ColorInputProps {
  label?: string;
  height?: string | number;
  width?: string | number;
  radius?: string;
  color?: string;
  onChange?: (color: string) => void;
  className?: string;
}

export interface DownloadSubItemParams {
  id: string;
  title: string;
  img: string | undefined;
  size: ItemSize;
  currentSize: ItemSize;
  speed?: ItemSpeed;
  status: string;
  error?: string;
}

export interface DownloadItemParams {
  id: string;
  title: string;
  img?: string | undefined;
  totalSize?: ItemSize;
  currentSize?: ItemSize;
  currentSpeed?: ItemSpeed;
  addedAt?: string;
  status?: string;
  items: DownloadSubItem[];
  error?: string;
}

export interface ItemProps {
  item: DownloadItem;
  isActive?: boolean;
  isSelected?: boolean;
  isSelectable?: boolean;
  className?: string;
  style?: object;
  onClick?: () => void;
  onSelect?: () => void;
}

export interface PresentModalProps {
  modalKey: string;
  modalProps?: object;
  onHide?: (...args: any[]) => void;
}

export interface PresentAlertProps {
  message: string;
  kind: 'success' | 'error';
  duration?: number;
}

export interface AppType {
  /**
   * Handle global modal
   */
  modalShown?: boolean;
  presentModal: (props: PresentModalProps) => void;
  closeModal: (...args: any[]) => void;
  modalKey: string;
  modalProps: object;

  /**
   * Handle alerts
   */
  alertShown?: boolean;
  alert: {
    message: string;
    kind: 'success' | 'error';
  };
  presentAlert: (props: PresentAlertProps) => void;
}

export interface StoreType {
  loadingItems: boolean;
  itemsList: DownloadItem[];
  currentItem: DownloadItem | null;
  loadItems: (
    search: string,
    filter: string,
    order: string,
    verbose?: boolean
  ) => Promise<void>;
  viewDetailsOf: (item: DownloadItem) => void;
}

export interface MoreButtonProps {
  selecting?: boolean;
  onToggleSelect: () => void;
  color?: string;
  className?: string;
  style?: object;
  activeOrder?: string;
  activeFilter?: string;
  onClickFilter: (filter: string) => void;
}
