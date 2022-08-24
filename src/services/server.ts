import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { BrowserWindow } from 'electron';
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

          case Channels.DONWLOAD_PROGRESSION:
            this.mainWindow?.webContents?.send(
              Channels.DONWLOAD_PROGRESSION,
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
    const pythonServer = spawn('python3', [`${__dirname}/server.py`], {
      env: {
        PATH: process.env.PATH,
      },
    });

    pythonServer.stderr.on('error', (error) => {
      this.mainWindow?.webContents?.send('openAlert', error?.message);
    });
  }

  fetchPlaylistContent(link: string) {
    const pythonServer = spawn(
      'python3',
      [`${__dirname}/server.py`, Channels.PLAYLIST_CONTENTS, link],
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
      'python3',
      [`${__dirname}/server.py`, Channels.SEED_VIDEO_SIZE, videoIds],
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
      'python3',
      [`${__dirname}/server.py`, Channels.START_VIDEOS_DOWNLOAD, videoIds],
      {
        env: {
          PATH: process.env.PATH,
        },
      }
    );
    this.handleProcess(pythonServer);
  }

  handleProcess(process: ChildProcessWithoutNullStreams) {
    process.stdout.on('data', (data) => {
      const response = this.parseMessage(data);

      if (!response?.success) {
        if (response?.topic === Channels.UNKNOWN_ERROR) {
          // console.log({ data: data?.toString() });
          this.mainWindow?.webContents.send(
            'openAlert',
            'An unexpected error occured !'
          );
        } else {
          this.mainWindow?.webContents.send(
            Channels.ERROR_OCCURED,
            JSON.stringify(response)
          );
          this.mainWindow?.webContents.send('openAlert', response?.value);
        }
      }
    });

    process.stderr.on('error', (error) => {
      // console.log({ error });
      this.mainWindow?.webContents.send(
        'openAlert',
        'An unexpected error occured !'
      );
    });
  }
}
