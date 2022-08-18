import {
  CANCELED_STATUS,
  COMPLETED_STATUS,
  DATE_FORMAT,
  PENDING_STATUS,
  RUNNING_STATUS,
} from 'configs';
import { Image1, Image2, Image3, Image4, Image5, Image6, Image7 } from 'assets';
import moment from 'moment';
import {
  DownloadItem,
  DownloadSubItem,
  ItemSize,
  ItemSpeed,
  SizeUnit,
  SpeedUnit,
} from 'models';

export const DOWNLOAD_ITEMS_LIST: DownloadItem[] = [
  new DownloadItem({
    id: '1',
    title: 'SwiftUI User Location on a Map MapKit & CoreLocation',
    img: Image1,
    totalSize: new ItemSize(2.45, SizeUnit.GIGABYTES),
    currentSize: new ItemSize(437.08, SizeUnit.MEGABYTES),
    currentSpeed: new ItemSpeed(254, SpeedUnit.KBS),
    addedAt: moment().subtract(8, 'days').format(DATE_FORMAT),
    status: RUNNING_STATUS,
    items: [
      new DownloadSubItem({
        id: '2',
        title: '#1 SwiftUI User Location - Project setup.mp4',
        img: Image1,
        size: new ItemSize(358.87, SizeUnit.MEGABYTES),
        currentSize: new ItemSize(358, SizeUnit.MEGABYTES),
        speed: new ItemSpeed(0, SpeedUnit.BS),
        status: COMPLETED_STATUS,
      }),
      new DownloadSubItem({
        id: '3',
        title: '#2 SwiftUI User Location - Adding map.mp4',
        img: Image2,
        size: new ItemSize(466.45, SizeUnit.MEGABYTES),
        currentSize: new ItemSize(78.21, SizeUnit.MEGABYTES),
        speed: new ItemSpeed(254, SpeedUnit.KBS),
        status: RUNNING_STATUS,
      }),
      new DownloadSubItem({
        id: '4',
        title: '#3 SwiftUI User Location - Configure view model.mp4',
        img: Image2,
        size: new ItemSize(700.45, SizeUnit.MEGABYTES),
        currentSize: new ItemSize(0, SizeUnit.BYTES),
        speed: new ItemSpeed(0, SpeedUnit.BS),
        status: PENDING_STATUS,
      }),
      new DownloadSubItem({
        id: '5',
        title: '#4 SwiftUI User Location - Wrapup.mp4',
        img: Image2,
        size: new ItemSize(924.23, SizeUnit.MEGABYTES),
        currentSize: new ItemSize(0, SizeUnit.BYTES),
        speed: new ItemSpeed(0, SpeedUnit.BS),
        status: PENDING_STATUS,
      }),
    ],
  }),
  new DownloadItem({
    id: '6',
    title: 'SNK Season 1',
    img: Image4,
    totalSize: new ItemSize(1.07, SizeUnit.GIGABYTES),
    currentSize: new ItemSize(1.07, SizeUnit.GIGABYTES),
    currentSpeed: new ItemSpeed(0, SpeedUnit.BS),
    addedAt: moment().subtract(13, 'days').format(DATE_FORMAT),
    status: COMPLETED_STATUS,
    items: [
      new DownloadSubItem({
        id: '7',
        title: '01.avi',
        img: Image3,
        size: new ItemSize(355.6, SizeUnit.MEGABYTES),
        currentSize: new ItemSize(0, SizeUnit.MEGABYTES),
        speed: new ItemSpeed(0, SpeedUnit.BS),
        status: COMPLETED_STATUS,
      }),
      new DownloadSubItem({
        id: '8',
        title: '02.avi',
        img: Image5,
        size: new ItemSize(355.6, SizeUnit.MEGABYTES),
        currentSize: new ItemSize(0, SizeUnit.MEGABYTES),
        speed: new ItemSpeed(0, SpeedUnit.BS),
        status: COMPLETED_STATUS,
      }),
      new DownloadSubItem({
        id: '9',
        title: '03.avi',
        img: Image6,
        size: new ItemSize(355.6, SizeUnit.MEGABYTES),
        currentSize: new ItemSize(0, SizeUnit.MEGABYTES),
        speed: new ItemSpeed(0, SpeedUnit.BS),
        status: COMPLETED_STATUS,
      }),
    ],
  }),
  new DownloadItem({
    id: '10',
    title: 'Sona Jobarteh & Band - Kora.mp4',
    img: Image7,
    totalSize: new ItemSize(269, SizeUnit.MEGABYTES),
    currentSize: new ItemSize(0, SizeUnit.BYTES),
    currentSpeed: new ItemSpeed(0, SpeedUnit.BS),
    addedAt: moment().subtract(13, 'days').format(DATE_FORMAT),
    status: CANCELED_STATUS,
    error: 'Connection timeout',
    items: [
      new DownloadSubItem({
        id: '11',
        title: 'Sona Jobarteh & Band - Kora.mp4',
        img: Image5,
        size: new ItemSize(269, SizeUnit.MEGABYTES),
        currentSize: new ItemSize(0, SizeUnit.MEGABYTES),
        speed: new ItemSpeed(0, SpeedUnit.BS),
        status: CANCELED_STATUS,
        error: 'Connection timeout',
      }),
    ],
  }),
];
