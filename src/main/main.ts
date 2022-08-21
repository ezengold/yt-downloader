/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { AppDatabase } from '../database';
import { MainServer } from '../services/server';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { Channels } from '../models';

// start main server for handling downloads
const server = new MainServer();

server.bootstrap();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  // console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1300,
    height: 800,
    minWidth: 1300,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    ipcMain.removeAllListeners(Channels.PLAYLIST_CONTENTS);
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line no-new
  new AppUpdater();
};

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(() => {});

/**
 * Custom events
 */
app.on('openSettings', () => mainWindow?.webContents.send('openSettings'));

app.on('openAbout', () => mainWindow?.webContents.send('openAbout'));

app.on('openNewDownload', () =>
  mainWindow?.webContents.send('openNewDownload')
);

app.on('openAlert', (message) =>
  mainWindow?.webContents.send('openAlert', message)
);

// user preferences
const db = new AppDatabase();

ipcMain.on(Channels.GET_COLOR_SCHEME, async (event) => {
  event.reply(Channels.GET_COLOR_SCHEME, db.getColorScheme());
});

ipcMain.on(Channels.SAVE_COLOR_SCHEME, async (event, [colorScheme]) => {
  db.updateColorScheme(colorScheme);
});

ipcMain.on(Channels.GET_DEFAULT_DOWNLOAD_LOCATION, async (event) => {
  event.reply(Channels.GET_DEFAULT_DOWNLOAD_LOCATION, db.getDownloadLocation());
});

ipcMain.on(
  Channels.SET_DEFAULT_DOWNLOAD_LOCATION,
  async (event, [location]) => {
    db.updateDownloadLocation(location);
  }
);

ipcMain.on(Channels.PLAYLIST_CONTENTS, async (event, link) => {
  server.fetchPlaylistContent(link);
});
app.on(Channels.PLAYLIST_CONTENTS, (str) =>
  mainWindow?.webContents.send(Channels.PLAYLIST_CONTENTS, str)
);
