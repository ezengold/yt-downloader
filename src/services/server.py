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

# async def time(websocket, path):
#     args = await websocket.recv()
#     args = args.split(" ")
#     with subprocess.Popen(["./binaries/yt-dl-mac", args[0], args[1]],
#                           stdout=subprocess.PIPE,
#                           bufsize=1,
#                           universal_newlines=True) as process:
#         for line in process.stdout:
#             line = line.rstrip()
#             print(f"line = {line}")
#             await websocket.send(line)

if len(args) > 1:
    if args[1] == PLAYLIST_CONTENTS:
        asyncio.run(get_playlist_contents())
else:
    asyncio.run(connection())
