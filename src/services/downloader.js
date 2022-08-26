const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const WSS_HOST = '127.0.0.1';
const WSS_PORT = 5678;

const START_VIDEOS_DOWNLOAD = 'START_VIDEOS_DOWNLOAD';
const DOWNLOAD_PROGRESSION = 'DOWNLOAD_PROGRESSION';

const DOWNLOAD_FAILED = 'DOWNLOAD_FAILED';
const DOWNLOAD_PROCESSING = 'DOWNLOAD_PROCESSING';
const DOWNLOAD_FINISHED = 'DOWNLOAD_FINISHED';

const server = new WebSocket(`ws://${WSS_HOST}:${WSS_PORT}`);

server.on('close', (error) => {
  process.exit(1);
});

server.on('error', (error) => {
  process.stderr.write('An unexpected error occured !');
  process.exit(1);
});

const downloadVideo = (videoId, url, path) => {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(path);

    const request = https
      .get(url, (response) => {
        const code = response.statusCode ?? 0;

        if (code >= 400) {
          if (server && typeof server?.send === 'function')
            server.send(
              JSON.stringify({
                topic: DOWNLOAD_PROGRESSION,
                value: {
                  video_id: videoId,
                  status: DOWNLOAD_FAILED,
                  downloaded: 0,
                  speed: 0,
                  error: 'Download expired',
                },
                success: false,
              })
            );
          resolve();
        }

        if (code > 300 && code < 400 && !!response.headers.location) {
          return downloadVideo(videoId, response.headers.location, path);
        }

        const totalSize = parseInt(response.headers['content-length'], 10);
        let downloadedSize = 0;

        response.pipe(file);

        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          if (server && typeof server?.send === 'function')
            server.send(
              JSON.stringify({
                topic: DOWNLOAD_PROGRESSION,
                value: {
                  video_id: videoId,
                  status: DOWNLOAD_PROCESSING,
                  downloaded: downloadedSize,
                  speed: 0,
                  error: '',
                },
                success: true,
              })
            );
        });

        file.on('finish', () => {
          file.close();
          if (server && typeof server?.send === 'function')
            server.send(
              JSON.stringify({
                topic: DOWNLOAD_PROGRESSION,
                value: {
                  video_id: videoId,
                  status: DOWNLOAD_FINISHED,
                  downloaded: 0,
                  speed: 0,
                  error: '',
                },
                success: true,
              })
            );
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(path, () => {});
        if (server && typeof server?.send === 'function')
          server.send(
            JSON.stringify({
              topic: DOWNLOAD_PROGRESSION,
              value: {
                video_id: videoId,
                status: DOWNLOAD_FAILED,
                downloaded: 0,
                error: 'Unable to resolve video',
              },
              success: false,
            })
          );
        resolve();
      });
  });
};

const main = () => {
  return new Promise((resolve) => {
    server.on('open', async () => {
      try {
        // videos = { video_id: string, download_url: string, location: string}[]
        const videos = JSON.parse(process.argv[2]);

        if (!Array.isArray(videos)) {
          throw new Error('Arguments not formatted as expected !');
        } else {
          for (const video of videos) {
            const videoId = video?.video_id || '';
            const downloadUrl = video?.download_url || '';
            const destinationPath = video?.location || '';
            if (!!videoId && !!downloadUrl && !!destinationPath)
              await downloadVideo(videoId, downloadUrl, destinationPath);
          }
          server.send(
            JSON.stringify({
              topic: START_VIDEOS_DOWNLOAD,
              value: {
                status: DOWNLOAD_FINISHED,
                error: '',
              },
              success: true,
            })
          );
          resolve();
        }
      } catch (error) {
        server.send(
          JSON.stringify({
            topic: START_VIDEOS_DOWNLOAD,
            value: error?.message || '',
            success: false,
          })
        );
        resolve();
      }
    });
  });
};

main().then(() => process.exit(1));
