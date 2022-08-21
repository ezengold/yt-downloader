import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { app } from 'electron';
import WebSocket, { WebSocketServer } from 'ws';
import { Channels, Message } from '../models';

export class MainServer {
  static WSS_HOST = '127.0.0.1';

  static WSS_PORT = 5678;

  server: ChildProcessWithoutNullStreams | undefined;

  socketServer: WebSocketServer | undefined;

  bootstrap(): void {
    this.createWebSocketServer();
    this.connectServer();
  }

  createWebSocketServer(): void {
    this.socketServer = new WebSocketServer({
      port: MainServer.WSS_PORT,
      host: MainServer.WSS_HOST,
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
            app.emit(Channels.PLAYLIST_CONTENTS, JSON.stringify(response));
            break;

          case Channels.START_PAYLIST_DOWNLOAD:
            break;

          case Channels.PLAYLIST_PROGRESSION:
            break;

          case Channels.CANCEL_PAYLIST_DOWNLOAD:
            break;

          case Channels.PLAYLIST_DOWNLOAD_FAILED:
            break;

          default:
            break;
        }
      });

      ws.on('error', (err) => {
        app.emit('openAlert', err?.message);
      });

      ws.on('close', (code, reason) => {
        console.log(`WSS CLOSED`);
      });
    });
  }

  parseMessage(data: WebSocket.RawData): Message<any> | null {
    try {
      return JSON.parse(data?.toString('utf-8')) as Message<any>;
    } catch (err) {
      return null;
    }
  }

  connectServer() {
    const pythonServer = spawn('python3', [`${__dirname}/server.py`], {
      env: {
        PATH: process.env.PATH,
      },
    });

    pythonServer.stderr.on('error', (error) => {
      app.emit('openAlert', error?.message);
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

    pythonServer.stderr.on('error', (error) => {
      app.emit('openAlert', error?.message);
    });
  }
}
