import sys
import asyncio
import websockets
import json
from pytube import Playlist
from pytube import YouTube
import speedtest

WSS_HOST = "127.0.0.1"
WSS_PORT = 5678

# list of all topics
CONNECTION_SUCCEEDED = "CONNECTION_SUCCEEDED"
PLAYLIST_CONTENTS = "PLAYLIST_CONTENTS"
SEED_VIDEO_SIZE = 'SEED_VIDEO_SIZE'

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
        try:
            playlist_link = args[2]
            playlist = Playlist(playlist_link)
            output = {
                "playlist_id": playlist.playlist_id,
                "playlist_url": playlist.playlist_url,
                "title": playlist.title,
                "videos": []
            }

            try:
                output["owner"] = playlist.owner
            except:
                output["owner"] = ""

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
        except:
            await websocket.send(json.dumps({
                "topic": PLAYLIST_CONTENTS,
                "value": "Failed to fetch playlist",
                "success": False
            }, default=str))


async def videos_seeding():
    async with websockets.connect("ws://%s:%d" % (WSS_HOST, WSS_PORT)) as websocket:
        try:
            videos_ids = json.loads(args[2])
            output = []
            for video_id in videos_ids:
                video = YouTube(f"https://youtube.com/watch?v={video_id}")
                # video_stream = video.streams.get_by_resolution('480p')
                # if video_stream == None:
                video_stream = video.streams.get_by_resolution('360p')
                if video_stream == None:
                    video_stream = video.streams.get_by_resolution('240p')
                video_size = video_stream.filesize
                download_url = video_stream.url
                expires_at = video_stream.expiration
                output.append({
                    "video_id": video_id,
                    "video_size": video_size,
                    "download_url": download_url,
                    "expires_at": expires_at
                })
            await websocket.send(json.dumps({
                "topic": SEED_VIDEO_SIZE,
                "value": output,
                "success": True
            }, default=str))
        except:
            await websocket.send(json.dumps({
                "topic": SEED_VIDEO_SIZE,
                "value": "Failed to seed the playlist videos",
                "success": False
            }, default=str))


def main():
    if len(args) > 1:
        if args[1] == PLAYLIST_CONTENTS:
            asyncio.run(get_playlist_contents())
        elif args[1] == SEED_VIDEO_SIZE:
            asyncio.run(videos_seeding())
    else:
        asyncio.run(connection())


main()
