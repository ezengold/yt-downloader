import subprocess
import sys
import json
import os
import signal
try:
    import argparse
except ModuleNotFoundError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", argparse])
from pytube.cli import on_progress
from pytube import Playlist


parser = argparse.ArgumentParser()
parser.add_argument('--content', type=str, help="Playlist contents")
parser.add_argument('--playlist', type=str, help="Download playlist")
parser.add_argument('--path', type=str,
                    help="Destination folder (absolute  path)")

args = parser.parse_args()

# Get a playlist content
if args.content:
    playlist = Playlist(args.content)
    output = {
        "playlist_id": playlist.playlist_id,
        "playlist_url": playlist.playlist_url,
        "title": playlist.title,
        "length": playlist.length,
        "owner": playlist.owner,
        "videos": []
    }
    for index, video in enumerate(playlist.videos):
        video_details = video.vid_info['videoDetails']
        # description contains not escaped characters
        del video_details["shortDescription"]
        # take lastest stream, can improve later
        # video_stream = video.streams.last()
        # video_details["size"] = video_stream.filesize
        # video_details["filesize_approx"] = video_stream.filesize_approx
        output["videos"].append(video_details)
        # if index == 2:
        #     break
    print(json.dumps(output, default=str))

    # print(json.dumps({
    #     "playlist_id": playlist.playlist_id,
    #     "playlist_url": playlist.playlist_url,
    #     "title": playlist.title,
    #     "length": playlist.length,
    #     "owner": playlist.owner,
    #     "last_updated": playlist.last_updated,
    #     "videos": list(map(lambda vi: {
    #         "video_id": vi.video_id,
    #         "title": vi.title,
    #         "length": vi.length,
    #         "thumbnail_url": vi.thumbnail_url,
    #     }, playlist.videos))
    # }, default=str))

# Download playlist
# elif args.playlist:
#     from pytube import Playlist
#     p = Playlist(args.playlist)
#     p_len = p.length
#     path = args.path if args.path else f"{default_path}/{p.title}"
#     print(f"Downloading {p.title} playlist in {path}")
#     for index, video in enumerate(p.videos):
#         print(video.)
#         title = video.title.replace('/', "_")
#         print(f"-  {index+1}/{p_len} Downloadind {title}")
#         video.register_on_progress_callback(on_progress)
#         video.streams.get_highest_resolution().download(output_path=path,
#                                                         filename=f"{index+1} - {title}.mp4")
