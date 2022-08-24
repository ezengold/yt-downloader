import { app } from 'electron';
import Store from 'electron-store';
import moment from 'moment';
import { DownloadItem } from '../models';
import { DATE_FORMAT, FILTER, ORDER } from '../configs';

export class AppDatabase {
  store: Store<{
    colorScheme: unknown;
    downloadLocation: unknown;
    downloadItems: unknown;
  }>;

  itemsDataSource: DownloadItem[] = [];

  constructor() {
    this.store = new Store({
      schema: {
        colorScheme: { type: 'string' },
        downloadLocation: {
          type: 'string',
          default: app.getPath('downloads'),
        },
        downloadItems: { type: 'string' },
      },
    });
    this.getDownloadItems();
    // ["HM9w1pRFHmo","KgN-VqgJVSw","5rBX1EoodNM","8l5yhh0m1HA","wxb8FvffRds","DyWUY4wE0Mw","VjiF5dMigZw","n59-NRcHnDM","rNk1qYdAK_k"]
  }

  /**
   * Get stored color scheme object
   * @returns colorScheme: Stringified json of `ColorSchemeStore` defined in types`
   */
  getColorScheme(): string {
    if (this.store) {
      return this.store?.get('colorScheme') as string;
    }
    return '';
  }

  /**
   * Update color scheme
   * @param scheme Stringified json of `ColorSchemeStore` defined in types`
   */
  updateColorScheme(scheme: string) {
    if (this.store) {
      this.store?.set('colorScheme', scheme);
    }
  }

  /**
   * Get default download location
   * @returns `downloadLocation`
   */
  getDownloadLocation(): string {
    if (this.store) {
      return this.store?.get('downloadLocation') as string;
    }
    return '';
  }

  /**
   * Update default download location
   * @param location default download location
   */
  updateDownloadLocation(location: string) {
    if (this.store) {
      this.store?.set('downloadLocation', location);
    }
  }

  /**
   * Get download items
   * @returns `downloadItems` encoded in str
   */
  getDownloadItems(): string {
    if (this.store) {
      const itemsStr = this.store?.get('downloadItems') as string;

      try {
        this.itemsDataSource = JSON.parse(itemsStr);
        return itemsStr;
      } catch (error) {
        this.itemsDataSource = [];
        return itemsStr;
      }
    }
    return '';
  }

  /**
   * Patch download items
   * @param items download items
   */
  patchDownloadItems(items: string) {
    if (this.store) {
      this.store?.set('downloadItems', items);

      try {
        this.itemsDataSource = JSON.parse(items);
      } catch (error) {
        // ignore
      }
    }
  }

  /**
   * Search items in data source
   * @param search search keyword
   * @param filter .NAME | .DATE | .SIZE
   * @param order .ASC | .DES
   */
  searchItems(
    search: string = '',
    filter: string = FILTER.DATE,
    order: string = ORDER.DESC
  ): string {
    if (Array.isArray(this.itemsDataSource)) {
      try {
        const matches = this.itemsDataSource?.filter((el) =>
          el?.title?.toUpperCase().includes(String(search?.toUpperCase()))
        );
        if (filter === FILTER.NAME) {
          matches.sort((a, b) => {
            if (order === ORDER.ASC) {
              return a?.title > b?.title ? 1 : a?.title < b?.title ? -1 : 0;
            } else {
              return a?.title > b?.title ? -1 : a?.title < b?.title ? 1 : 0;
            }
          });
        } else if (filter === FILTER.DATE) {
          matches.sort((a, b) => {
            if (order === ORDER.ASC) {
              return moment(a?.addedAt, DATE_FORMAT).unix() >
                moment(b?.addedAt, DATE_FORMAT).unix()
                ? 1
                : moment(a?.addedAt, DATE_FORMAT).unix() <
                  moment(b?.addedAt, DATE_FORMAT).unix()
                ? -1
                : 0;
            } else {
              return moment(a?.addedAt, DATE_FORMAT).unix() >
                moment(b?.addedAt, DATE_FORMAT).unix()
                ? -1
                : moment(a?.addedAt, DATE_FORMAT).unix() <
                  moment(b?.addedAt, DATE_FORMAT).unix()
                ? 1
                : 0;
            }
          });
        } else if (filter === FILTER.SIZE) {
          matches.sort((a, b) => {
            if (order === ORDER.ASC) {
              return (a?.totalSize?.value || 0) > (b?.totalSize?.value || 0)
                ? 1
                : (a?.totalSize?.value || 0) < (b?.totalSize?.value || 0)
                ? -1
                : 0;
            } else {
              return (a?.totalSize?.value || 0) > (b?.totalSize?.value || 0)
                ? 1
                : (a?.totalSize?.value || 0) < (b?.totalSize?.value || 0)
                ? -1
                : 0;
            }
          });
        }
        return JSON.stringify(matches);
      } catch (error) {
        return JSON.stringify([]);
      }
    } else {
      return JSON.stringify([]);
    }
  }
}
