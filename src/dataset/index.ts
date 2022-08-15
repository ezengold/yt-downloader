import {
  CANCELED_STATUS,
  COMPLETED_STATUS,
  DATE_FORMAT,
  PENDING_STATUS,
  RUNNING_STATUS,
  SizeUnits,
  SpeedUnits,
} from 'configs';
import { Image1, Image2, Image3, Image4, Image5, Image6, Image7 } from 'assets';
import moment from 'moment';
import { DownloadItem } from 'types';

export const DOWNLOAD_ITEMS_LIST: DownloadItem[] = [
  {
    id: '1',
    title: 'SwiftUI User Location on a Map MapKit & CoreLocation',
    img: Image1,
    totalSize: {
      value: 2.45,
      unit: SizeUnits.GIGABYTES,
    },
    currentSize: {
      value: 437.08,
      unit: SizeUnits.MEGABYTES,
    },
    currentSpeed: {
      value: 254,
      unit: SpeedUnits.KBS,
    },
    addedAt: moment().subtract(8, 'days').format(DATE_FORMAT),
    status: RUNNING_STATUS,
    items: [
      {
        id: '2',
        title: '#1 SwiftUI User Location - Project setup.mp4',
        img: Image1,
        size: {
          value: 358.87,
          unit: SizeUnits.MEGABYTES,
        },
        currentSize: {
          value: 358.87,
          unit: SizeUnits.MEGABYTES,
        },
        speed: {
          value: 0,
          unit: SpeedUnits.BS,
        },
        status: COMPLETED_STATUS,
      },
      {
        id: '3',
        title: '#2 SwiftUI User Location - Adding map.mp4',
        img: Image2,
        size: {
          value: 466.45,
          unit: SizeUnits.MEGABYTES,
        },
        currentSize: {
          value: 78.21,
          unit: SizeUnits.MEGABYTES,
        },
        speed: {
          value: 254,
          unit: SpeedUnits.KBS,
        },
        status: RUNNING_STATUS,
      },
      {
        id: '4',
        title: '#3 SwiftUI User Location - Configure view model.mp4',
        img: Image2,
        size: {
          value: 700.45,
          unit: SizeUnits.MEGABYTES,
        },
        currentSize: {
          value: 0,
          unit: SizeUnits.BYTES,
        },
        speed: {
          value: 0,
          unit: SpeedUnits.BS,
        },
        status: PENDING_STATUS,
      },
      {
        id: '5',
        title: '#4 SwiftUI User Location - Wrapup.mp4',
        img: Image2,
        size: {
          value: 924.23,
          unit: SizeUnits.MEGABYTES,
        },
        currentSize: {
          value: 0,
          unit: SizeUnits.BYTES,
        },
        speed: {
          value: 0,
          unit: SpeedUnits.BS,
        },
        status: PENDING_STATUS,
      },
    ],
  },
  {
    id: '6',
    title: 'SNK Season 1',
    img: Image4,
    totalSize: {
      value: 1.07,
      unit: SizeUnits.MEGABYTES,
    },
    currentSize: {
      value: 1.07,
      unit: SizeUnits.MEGABYTES,
    },
    currentSpeed: {
      value: 0,
      unit: SpeedUnits.BS,
    },
    addedAt: moment().subtract(13, 'days').format(DATE_FORMAT),
    status: COMPLETED_STATUS,
    items: [
      {
        id: '7',
        title: '01.avi',
        img: Image3,
        size: {
          value: 355.6,
          unit: SizeUnits.MEGABYTES,
        },
        currentSize: {
          value: 355.6,
          unit: SizeUnits.MEGABYTES,
        },
        speed: {
          value: 0,
          unit: SpeedUnits.BS,
        },
        status: COMPLETED_STATUS,
      },
      {
        id: '8',
        title: '02.avi',
        img: Image5,
        size: {
          value: 355.6,
          unit: SizeUnits.MEGABYTES,
        },
        currentSize: {
          value: 355.6,
          unit: SizeUnits.MEGABYTES,
        },
        speed: {
          value: 0,
          unit: SpeedUnits.BS,
        },
        status: COMPLETED_STATUS,
      },
      {
        id: '9',
        title: '03.avi',
        img: Image6,
        size: {
          value: 355.6,
          unit: SizeUnits.MEGABYTES,
        },
        currentSize: {
          value: 355.6,
          unit: SizeUnits.MEGABYTES,
        },
        speed: {
          value: 0,
          unit: SpeedUnits.BS,
        },
        status: COMPLETED_STATUS,
      },
    ],
  },
  {
    id: '10',
    title: 'Sona Jobarteh & Band - Kora.mp4',
    img: Image7,
    totalSize: {
      value: 269,
      unit: SizeUnits.MEGABYTES,
    },
    currentSize: {
      value: 0,
      unit: SizeUnits.BYTES,
    },
    currentSpeed: {
      value: 0,
      unit: SpeedUnits.BS,
    },
    addedAt: moment().subtract(13, 'days').format(DATE_FORMAT),
    status: CANCELED_STATUS,
    error: 'Connection timeout',
    items: [
      {
        id: '11',
        title: 'Sona Jobarteh & Band - Kora.mp4',
        img: Image5,
        size: {
          value: 269,
          unit: SizeUnits.MEGABYTES,
        },
        currentSize: {
          value: 0,
          unit: SizeUnits.BYTES,
        },
        speed: {
          value: 0,
          unit: SpeedUnits.BS,
        },
        status: CANCELED_STATUS,
        error: 'Connection timeout',
      },
    ],
  },
];
