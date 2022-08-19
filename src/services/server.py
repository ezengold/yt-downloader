import sys
import asyncio
import subprocess
import websockets
import json

WSS_HOST = "127.0.0.1"
WSS_PORT = 5678

# list of all topics
CONNECTION_SUCCEEDED = "CONNECTION_SUCCEEDED"
PLAYLIST_CONTENTS = "PLAYLIST_CONTENTS"
START_PAYLIST_DOWNLOAD = "START_PAYLIST_DOWNLOAD"
PLAYLIST_PROGRESSION = "PLAYLIST_PROGRESSION"
CANCEL_PAYLIST_DOWNLOAD = "CANCEL_PAYLIST_DOWNLOAD"
PLAYLIST_DOWNLOAD_FAILED = "PLAYLIST_DOWNLOAD_FAILED"

args = sys.argv


async def connection():
    async with websockets.connect("ws://%s:%d" % (WSS_HOST, WSS_PORT)) as websocket:
        await websocket.send(json.dumps({
            "topic": CONNECTION_SUCCEEDED,
            "value": "Connected successfully"
        }))


async def get_playlist_contents():
    playlist_link = args[2]
    print(json.dumps({
        "topic": PLAYLIST_CONTENTS,
        "value": {
            "title": "SwiftUI User Location on a Map MapKit & CoreLocation",
            "url": playlist_link,
            "size": 1265156313,
            "items": []
        }
    }))


async def start_playlist_download():
    print(json.dumps({
        "topic": START_PAYLIST_DOWNLOAD,
        "value": "Lorem ipsum dolor"
    }))


async def get_playlist_download_progression():
    print(json.dumps({
        "topic": PLAYLIST_PROGRESSION,
        "value": "Lorem ipsum dolor"
    }))


async def stop_playlist_download():
    print(json.dumps({
        "topic": CANCEL_PAYLIST_DOWNLOAD,
        "value": "Lorem ipsum dolor"
    }))


def main():
    if len(args) > 1:
        if args[1] == PLAYLIST_CONTENTS:
            asyncio.run(get_playlist_contents())
        elif args[1] == START_PAYLIST_DOWNLOAD:
            asyncio.run(start_playlist_download())
        elif args[1] == PLAYLIST_PROGRESSION:
            asyncio.run(get_playlist_download_progression())
        elif args[1] == CANCEL_PAYLIST_DOWNLOAD:
            asyncio.run(stop_playlist_download())
    else:
        asyncio.run(connection())


main()
