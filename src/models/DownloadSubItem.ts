import { DownloadSubItemParams } from 'types';
import { ItemSize } from './ItemSize';
import { ItemSpeed } from './ItemSpeed';

export class DownloadSubItem {
  id: string;

  title: string;

  img: string | undefined;

  size: ItemSize;

  currentSize: ItemSize;

  speed?: ItemSpeed;

  status: string;

  error?: string;

  constructor(params: DownloadSubItemParams) {
    this.id = params?.id;
    this.title = params?.title;
    this.img = params?.img;
    this.size = params?.size;
    this.currentSize = params?.currentSize;
    this.speed = params?.speed;
    this.status = params?.status;
    this.error = params?.error;
  }
}
