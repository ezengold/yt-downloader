import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuMain: DarwinMenuItemConstructorOptions = {
      label: 'yt-Downloader',
      submenu: [
        {
          label: 'New download',
          accelerator: 'Command+Plus',
          click: () => app.emit('openNewDownload'),
        },
        {
          label: 'Settings',
          click: () => app.emit('openSettings'),
        },
        { type: 'separator' },
        {
          label: 'Quit yt-Downloader',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuAbout: MenuItemConstructorOptions = {
      label: 'About',
      submenu: [
        {
          label: 'About',
          click: () => app.emit('openAbout'),
        },
        {
          label: 'Visit us',
          click() {
            shell.openExternal(
              'https://github.com/EZENGOLD/yt-downloader#readme'
            );
          },
        },
      ],
    };
    const subMenuView: MenuItemConstructorOptions = {
      label: 'Developer',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };

    return [
      subMenuMain,
      subMenuEdit,
      subMenuAbout,
      ...(process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? [subMenuView]
        : []),
    ];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&yt-Downloader',
        submenu: [
          {
            label: 'New download',
            accelerator: 'Ctrl+N',
            click: () => app.emit('openNewDownload'),
          },
          {
            label: 'Settings',
            click: () => app.emit('openSettings'),
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: 'About',
        submenu: [
          {
            label: 'About',
            click: () => app.emit('openAbout'),
          },
          {
            label: 'Visit us',
            click() {
              shell.openExternal(
                'https://github.com/EZENGOLD/yt-downloader#readme'
              );
            },
          },
        ],
      },
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? {
            label: 'Developer',
            submenu: [
              {
                label: '&Reload',
                accelerator: 'Ctrl+R',
                click: () => {
                  this.mainWindow.webContents.reload();
                },
              },
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: () => {
                  this.mainWindow.setFullScreen(
                    !this.mainWindow.isFullScreen()
                  );
                },
              },
              {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click: () => {
                  this.mainWindow.webContents.toggleDevTools();
                },
              },
            ],
          }
        : null,
    ];

    return templateDefault.filter((el) => !!el);
  }
}
