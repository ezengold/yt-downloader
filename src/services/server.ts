import { ChildProcessWithoutNullStreams, execFile } from 'child_process';
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
            // no need of real time :)
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
        console.log(`Close wss [${code}] -> ${reason?.toString()}`);
      });
    });
  }

  parseMessage(data: WebSocket.RawData): Message | null {
    try {
      return JSON.parse(data.toString()) as Message;
    } catch (err) {
      return null;
    }
  }

  connectServer() {
    execFile(`python3 ${__dirname}/server.py`, (error) => {
      if (error) {
        app.emit('openAlert', error?.message);
      }
    });
  }

  fetchPlaylistContent(link: string, callback: (response: string) => void) {
    execFile(
      `python3 ${__dirname}/server.py ${Channels.PLAYLIST_CONTENTS} ${link}`,
      (error, stdout, stderr) => {
        if (error || stderr) {
          app.emit('openAlert', error?.message);
          callback('');
        } else {
          callback(stdout);
        }
      }
    );
  }
}
