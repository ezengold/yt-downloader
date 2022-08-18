import { DownloadItemParams } from 'types';
import { ItemSize } from './ItemSize';
import { ItemSpeed } from './ItemSpeed';
import { DownloadSubItem } from './DownloadSubItem';

export class DownloadItem {
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

  constructor(params: DownloadItemParams) {
    this.id = params?.id;
    this.title = params?.title;
    this.img = params?.img;
    this.totalSize = params?.totalSize;
    this.currentSize = params?.currentSize;
    this.currentSpeed = params?.currentSpeed;
    this.addedAt = params?.addedAt;
    this.status = params?.status;
    this.items = params?.items;
    this.error = params?.error;
  }
}
