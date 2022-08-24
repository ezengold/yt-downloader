import sys
import asyncio
import websockets
import json
from pytube import Playlist
from pytube import YouTube
from pytube import Stream
import speedtest

WSS_HOST = "127.0.0.1"
WSS_PORT = 5678

# list of all topics
CONNECTION_SUCCEEDED = "CONNECTION_SUCCEEDED"
PLAYLIST_CONTENTS = "PLAYLIST_CONTENTS"
SEED_VIDEO_SIZE = 'SEED_VIDEO_SIZE'
VIDEO_SIZE_AVAILABLE = 'VIDEO_SIZE_AVAILABLE'
START_VIDEOS_DOWNLOAD = "START_VIDEOS_DOWNLOAD"
DOWNLOAD_PROGRESSION = "DOWNLOAD_PROGRESSION"

# download progression status
DOWNLOAD_FAILED = "DOWNLOAD_FAILED"
DOWNLOAD_PROCESSING = "DOWNLOAD_PROCESSING"
DOWNLOAD_FINISHED = "DOWNLOAD_FINISHED"

args = sys.argv

speed_test = speedtest.Speedtest()


async def connection():
    async with websockets.connect("ws://%s:%d" % (WSS_HOST, WSS_PORT)) as websocket:
        await websocket.send(json.dumps({
            "topic": CONNECTION_SUCCEEDED,
            "value": "Connected successfully",
            "success": True
        }))


async def get_playlist_contents():
    async with websockets.connect("ws://%s:%d" % (WSS_HOST, WSS_PORT)) as websocket:
        playlist_link = args[2]
        playlist = Playlist(playlist_link)
        output = {
            "playlist_id": playlist.playlist_id,
            "playlist_url": playlist.playlist_url,
            "title": playlist.title,
            "length": playlist.length,
            "owner": playlist.owner,
            "videos": []
        }
        for video in playlist.videos:
            video_details = video.vid_info['videoDetails']
            # description contains not escaped characters
            del video_details["shortDescription"]
            output["videos"].append(video_details)
        await websocket.send(json.dumps({
            "topic": PLAYLIST_CONTENTS,
            "value": output,
            "success": True
        }, default=str))


async def videos_seeding():
    async with websockets.connect("ws://%s:%d" % (WSS_HOST, WSS_PORT)) as websocket:
        videos_ids = json.loads(args[2])
        output = []
        for video_id in videos_ids:
            video = YouTube(f"https://youtube.com/watch?v={video_id}")
            video_size = video.streams.last().filesize
            output.append({
                "video_id": video_id,
                "video_size": video_size
            })
        await websocket.send(json.dumps({
            "topic": SEED_VIDEO_SIZE,
            "value": output,
            "success": True
        }, default=str))


async def on_video_download_progressing(stream: Stream, chunk: bytes, bytes_remaining: int, video_id):
    async with websockets.connect("ws://%s:%d" % (WSS_HOST, WSS_PORT)) as websocket:
        await websocket.send(json.dumps({
            "topic": DOWNLOAD_PROGRESSION,
            "value": {
                "video_id": video_id,
                "status": DOWNLOAD_PROCESSING,
                "downloaded": stream.filesize - bytes_remaining,
                "speed": speed_test.download(),
                "error": ""
            },
            "success": True
        }, default=str))


async def on_video_download_start(video_id: str):
    async with websockets.connect("ws://%s:%d" % (WSS_HOST, WSS_PORT)) as websocket:
        await websocket.send(json.dumps({
            "topic": DOWNLOAD_PROGRESSION,
            "value": {
                "video_id": video_id,
                "status": DOWNLOAD_PROCESSING,
                "downloaded": 0,
                "speed": speed_test.download(),
                "error": ""
            },
            "success": True
        }, default=str))


async def on_video_download_completed(stream: Stream, file_path: str, video_id: str):
    async with websockets.connect("ws://%s:%d" % (WSS_HOST, WSS_PORT)) as websocket:
        await websocket.send(json.dumps({
            "topic": DOWNLOAD_PROGRESSION,
            "value": {
                "video_id": video_id,
                "status": DOWNLOAD_FINISHED,
                "speed": speed_test.download(),
                "error": ""
            },
            "success": True
        }, default=str))


async def on_video_download_failed(video_id):
    async with websockets.connect("ws://%s:%d" % (WSS_HOST, WSS_PORT)) as websocket:
        await websocket.send(json.dumps({
            "topic": DOWNLOAD_PROGRESSION,
            "value": {
                "video_id": video_id,
                "status": DOWNLOAD_FAILED,
                "downloaded": 0,
                "error": "Unable to resolve video"
            },
            "success": False
        }, default=str))


async def on_all_videos_download_finished(status: str = DOWNLOAD_FINISHED, error: str = ""):
    async with websockets.connect("ws://%s:%d" % (WSS_HOST, WSS_PORT)) as websocket:
        await websocket.send(json.dumps({
            "topic": START_VIDEOS_DOWNLOAD,
            "value": {
                "status": status,
                "error": error
            },
            "success": False if status == DOWNLOAD_FAILED else True
        }, default=str))


def start_videos_download():
    try:
        # videos = {video_id: str, location: str}[]
        videos = json.loads(args[2])
        for video in videos:
            video_id = video['video_id']
            video_location = video['location']
            asyncio.run(on_video_download_start(video_id))
            yt_video = YouTube(
                url=f"https://youtube.com/watch?v={video_id}",
                on_progress_callback=lambda stream, chunk, bytes_remaining: asyncio.run(on_video_download_progressing(
                    stream,
                    chunk,
                    bytes_remaining,
                    video_id=video_id
                )),
                on_complete_callback=lambda stream, file_path: asyncio.run(on_video_download_completed(
                    stream=stream,
                    file_path=file_path,
                    video_id=video_id
                ))
            )
            video_title = yt_video.title.replace("/", "_")
            yt_video_stream: Stream = yt_video.streams.last()
            if yt_video_stream != None:
                yt_video_stream.download(
                    output_path=video_location,
                    filename=f"{video_title}.mp4",
                )
            else:
                asyncio.run(on_video_download_failed(video_id))
        asyncio.run(on_all_videos_download_finished())
    except:
        asyncio.run(on_all_videos_download_finished(
            status=DOWNLOAD_FAILED,
            error="Download failed"
        ))


def main():
    if len(args) > 1:
        if args[1] == PLAYLIST_CONTENTS:
            asyncio.run(get_playlist_contents())
        elif args[1] == SEED_VIDEO_SIZE:
            asyncio.run(videos_seeding())
        elif args[1] == START_VIDEOS_DOWNLOAD:
            start_videos_download()
    else:
        asyncio.run(connection())


main()
