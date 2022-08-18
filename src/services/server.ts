import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export class MainServer {
  server: ChildProcessWithoutNullStreams | undefined;

  bootstrap(): void {
    const serverInstance = spawn('python3', [`${__dirname}/server.py`]);

    this.server = serverInstance;

    if (serverInstance) {
      serverInstance.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      serverInstance.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      serverInstance.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });
    }
  }
}
