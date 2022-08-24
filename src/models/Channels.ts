export class Channels {
  static HOST = '127.0.0.1';

  static PORT = 5678;

  /**
   * Connection to socket server succeeded
   */
  static CONNECTION_SUCCEEDED = 'CONNECTION_SUCCEEDED';

  /**
   * Get details and contents of a playlist
   */
  static PLAYLIST_CONTENTS = 'PLAYLIST_CONTENTS';

  /**
   * Start a playlist download
   * The plalist will already be saved in DB, with
   * items that user have selected for download
   */
  static START_VIDEOS_DOWNLOAD = 'START_VIDEOS_DOWNLOAD';

  /**
   * Get a playlist download progression
   */
  static DONWLOAD_PROGRESSION = 'DONWLOAD_PROGRESSION';

  /**
   * Cancel a playlist download
   */
  static CANCEL_VIDEOS_DOWNLOAD = 'CANCEL_VIDEOS_DOWNLOAD';

  /**
   * Download failed due to unexpected error
   */
  static DOWNLOAD_FAILED = 'DOWNLOAD_FAILED';

  /**
   * Get color scheme in user preferences
   */
  static GET_COLOR_SCHEME = 'GET_COLOR_SCHEME';

  /**
   * Save color scheme in user preferences
   */
  static SAVE_COLOR_SCHEME = 'SAVE_COLOR_SCHEME';

  /**
   * Get default download location
   */
  static GET_DEFAULT_DOWNLOAD_LOCATION = 'GET_DEFAULT_DOWNLOAD_LOCATION';

  /**
   * Set download location by default
   */
  static SET_DEFAULT_DOWNLOAD_LOCATION = 'SET_DEFAULT_DOWNLOAD_LOCATION';

  /**
   * Built in ipc example
   */
  static IPC_EXAMPLE = 'ipc-example';

  /**
   * Channel when error occured
   */
  static ERROR_OCCURED = 'ERROR_OCCURED';

  static UNKNOWN_ERROR = 'UNKNOWN_ERROR';

  /**
   * Download items
   */
  static GET_DOWNLOAD_ITEMS = 'GET_DOWNLOAD_ITEMS';

  static SEARCH_DOWNLOAD_ITEMS = 'SEARCH_DOWNLOAD_ITEMS';

  static PATCH_DOWNLOAD_ITEMS = 'PATCH_DOWNLOAD_ITEMS';

  static SEED_VIDEO_SIZE = 'SEED_VIDEO_SIZE';
}
