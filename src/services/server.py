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


async def connection():
    async with websockets.connect("ws://%s:%d" % (WSS_HOST, WSS_PORT)) as websocket:
        await websocket.send(json.dumps({
            "topic": CONNECTION_SUCCEEDED,
            "value": "Hello World !"
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

asyncio.run(connection())
