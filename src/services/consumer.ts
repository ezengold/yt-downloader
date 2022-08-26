import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { BrowserWindow } from 'electron';
import path from 'path';
import WebSocket, { WebSocketServer } from 'ws';
import { Channels, Message } from '../models';

export class MainServer {
  mainWindow: BrowserWindow | null | undefined;

  server: ChildProcessWithoutNullStreams | undefined;

  socketServer: WebSocketServer | undefined;

  bootstrap(): void {
    this.createWebSocketServer();
    this.connectServer();
  }

  createWebSocketServer(): void {
    this.socketServer = new WebSocketServer({
      port: Channels.PORT,
      host: Channels.HOST,
    });
    this.installWssListeners();
  }

  installWssListeners() {
    this.socketServer?.on('connection', (ws: WebSocket.WebSocket) => {
      ws.on('message', (data) => {
        const response = this.parseMessage(data);

        switch (response?.topic) {
          case Channels.CONNECTION_SUCCEEDED:
            // and there goes life :)
            break;

          case Channels.PLAYLIST_CONTENTS:
            this.mainWindow?.webContents?.send(
              Channels.PLAYLIST_CONTENTS,
              JSON.stringify(response)
            );
            break;

          case Channels.SEED_VIDEO_SIZE:
            this.mainWindow?.webContents?.send(
              Channels.SEED_VIDEO_SIZE,
              JSON.stringify(response)
            );
            break;

          case Channels.START_VIDEOS_DOWNLOAD:
            this.mainWindow?.webContents?.send(
              Channels.START_VIDEOS_DOWNLOAD,
              JSON.stringify(response)
            );
            break;

          case Channels.DOWNLOAD_PROGRESSION:
            this.mainWindow?.webContents?.send(
              Channels.DOWNLOAD_PROGRESSION,
              JSON.stringify(response)
            );
            break;

          default:
            break;
        }
      });

      ws.on('error', (err) => {
        this.mainWindow?.webContents?.send('openAlert', err?.message);
      });

      ws.on('close', (code, reason) => {
        console.log(`WSS CLOSED`);
      });
    });
  }

  parseMessage(data: WebSocket.RawData): Message<any> | null {
    try {
      const decoded = JSON.parse(data?.toString('utf-8')) as object;
      if (
        decoded.hasOwnProperty('success') &&
        decoded.hasOwnProperty('value') &&
        decoded.hasOwnProperty('topic')
      ) {
        return decoded as Message<any>;
      } else {
        throw new Error('NOT_MESSAGE_FORMAT');
      }
    } catch (err) {
      const error = new Message<any>();
      error.success = false;
      error.topic = Channels.UNKNOWN_ERROR;
      error.value = JSON.parse(data?.toString('utf-8'));
      return error;
    }
  }

  connectServer() {
    console.log(this.resolveScript(this.getPlatformServerScriptName()));

    const pythonServer = spawn(
      this.resolveScript(this.getPlatformServerScriptName()),
      [],
      {
        env: {
          PATH: process.env.PATH,
        },
      }
    );

    pythonServer.stderr.on('error', (error) => {
      this.mainWindow?.webContents?.send('openAlert', error?.message);
    });
  }

  fetchPlaylistContent(link: string) {
    const pythonServer = spawn(
      this.resolveScript(this.getPlatformServerScriptName()),
      [Channels.PLAYLIST_CONTENTS, link],
      {
        env: {
          PATH: process.env.PATH,
        },
      }
    );
    this.handleProcess(pythonServer);
  }

  seedVideos(videoIds: string) {
    const pythonServer = spawn(
      this.resolveScript(this.getPlatformServerScriptName()),
      [Channels.SEED_VIDEO_SIZE, videoIds],
      {
        env: {
          PATH: process.env.PATH,
        },
      }
    );
    this.handleProcess(pythonServer);
  }

  downloadVideos(videoIds: string) {
    const pythonServer = spawn(
      'node',
      [this.resolveScript('downloader.js'), videoIds],
      {
        env: {
          PATH: process.env.PATH,
        },
      }
    );

    this.server = pythonServer;
    this.handleProcess(pythonServer);
  }

  killCurrentDownload() {
    if (this.server) {
      this.server?.stdin.destroy();
      this.server?.stdout.destroy();
      if (this.server?.kill('SIGKILL')) console.log('DOWNLOAD TASK KILLED');
    }
  }

  handleProcess(theProcess: ChildProcessWithoutNullStreams) {
    theProcess.stdout.on('data', (data) => {
      const response = this.parseMessage(data);

      if (!response?.success) {
        if (response?.topic === Channels.UNKNOWN_ERROR) {
          // console.log({ data: data?.toString() });
          this.mainWindow?.webContents.send(
            'openAlert',
            'An unexpected error occured !'
          );
        } else {
          this.mainWindow?.webContents.send('openAlert', response?.value);
        }
      }
    });

    theProcess.stderr.on('error', (error) => {
      // console.log({ error });
      this.mainWindow?.webContents.send(
        'openAlert',
        'An unexpected error occured !'
      );
    });
  }

  resolveScript(scriptName: string): string {
    if (process.env.NODE_ENV === 'production') {
      return path.join(process.resourcesPath, 'cmd', scriptName);
    } else {
      return path.join(__dirname, '../cmd', scriptName);
    }
  }

  getPlatformServerScriptName(): string {
    if (process.platform === 'win32') {
      // windows
      return 'server-win.exe';
    } else if (process.platform === 'darwin') {
      // macOS
      return 'server-darwin';
    } else {
      // linux
      return 'server-linux';
    }
  }
}
