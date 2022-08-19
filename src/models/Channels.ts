export class Channels {
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
  static START_PAYLIST_DOWNLOAD = 'START_PAYLIST_DOWNLOAD';

  /**
   * Get a playlist download progression
   */
  static PLAYLIST_PROGRESSION = 'PLAYLIST_PROGRESSION';

  /**
   * Cancel a playlist download
   */
  static CANCEL_PAYLIST_DOWNLOAD = 'CANCEL_PAYLIST_DOWNLOAD';

  /**
   * Download failed due to unexpected error
   */
  static PLAYLIST_DOWNLOAD_FAILED = 'PLAYLIST_DOWNLOAD_FAILED';
}
