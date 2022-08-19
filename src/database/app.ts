import Store from 'electron-store';

export class AppDatabase {
  store: Store<{
    colorScheme: unknown;
    downloadLocation: unknown;
  }>;

  constructor() {
    this.store = new Store({
      schema: {
        colorScheme: { type: 'string' },
        downloadLocation: { type: 'string' },
      },
    });
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
}
