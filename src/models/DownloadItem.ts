import { DownloadItemParams } from 'types';
import { ItemSize } from './ItemSize';
import { ItemSpeed } from './ItemSpeed';
import { DownloadSubItem } from './DownloadSubItem';

export class DownloadItem {
  id: string;

  playlist_id?: string = '';

  url?: string = '';

  location?: string = '';

  title: string;

  img?: string | undefined;

  totalSize?: ItemSize;

  currentSize?: ItemSize;

  currentSpeed?: ItemSpeed;

  addedAt?: string;

  status?: string;

  items: DownloadSubItem[];

  error?: string;

  owner?: string = '';

  constructor(params: DownloadItemParams) {
    this.id = params?.id;
    this.playlist_id = params?.playlist_id;
    this.url = params?.url;
    this.location = params?.location;
    this.title = params?.title;
    this.img = params?.img;
    this.totalSize = params?.totalSize;
    this.currentSize = params?.currentSize;
    this.currentSpeed = params?.currentSpeed;
    this.addedAt = params?.addedAt;
    this.status = params?.status;
    this.items = params?.items;
    this.error = params?.error;
    this.owner = params?.owner;
  }
}
