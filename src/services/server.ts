import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import WebSocket, { WebSocketServer } from 'ws';
import { Channels, Message } from '../models';

export class MainServer {
  static WSS_HOST = '127.0.0.1';

  static WSS_PORT = 5678;

  server: ChildProcessWithoutNullStreams | undefined;

  socketServer: WebSocketServer | undefined;

  bootstrap(): void {
    this.createWebSocketServer();
    // this.connectServer();
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
        console.log(`Error on wss -> ${err?.message}`);
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
    spawn(`python3 ${__dirname}/server.py`, []).on('error', (err) => {
      console.log(`\n\nspawn error -> ${err?.message}\n\n`);
    });
  }

  fetchPlaylistContent(link: string): string {
    let output = '';

    const serverInstance = spawn(`python3 ${__dirname}/server.py`, [
      Channels.PLAYLIST_CONTENTS,
      link,
    ]).on('error', (err) => {
      console.log(`\n\nspawn error -> ${err?.message}\n\n`);
    });

    if (serverInstance.pid) {
      serverInstance.stdout.on('data', (data) => {
        console.log(`\n\n${Channels.PLAYLIST_CONTENTS} stdout -> ${data}\n\n`);
        output = data;
      });

      serverInstance.stderr.on('data', (data) => {
        console.log(`\n\n${Channels.PLAYLIST_CONTENTS} error -> ${data}\n\n`);
      });

      serverInstance.on('close', (code) => {
        console.log(
          `\n\n${Channels.PLAYLIST_CONTENTS} child process exited with code ${code}\n\n`
        );
      });
    }
    return output;
  }
}
