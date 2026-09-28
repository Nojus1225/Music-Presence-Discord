# ================================================
# LIBRARIES
# ================================================
import asyncio
import json
import sys

from winsdk.windows.media.control import GlobalSystemMediaTransportControlsSessionManager

# ================================================
# VARIABLES
# ================================================
STATUS_NAMES = {
    0: "Unknown",
    1: "Closed",
    2: "Opened",
    3: "Changing",
    4: "Playing",
    5: "Paused",
    6: "Stopped",
}

last_state = None

# ================================================
# SEND DATA
# ================================================
def send(data):
    print(json.dumps(data, ensure_ascii=False), flush=True)

# ================================================
# GET MEDIA STATE
# ================================================
async def get_media_state():
    manager = await GlobalSystemMediaTransportControlsSessionManager.request_async()
    session = manager.get_current_session()
    if session is None:
        return {"active": False, "status": "Stopped"}

    properties = await session.try_get_media_properties_async()
    playback_info = session.get_playback_info()
    status_code = 0

    if playback_info is not None:
        status_code = int(playback_info.playback_status)

    status_name = STATUS_NAMES.get(status_code, "Unknown")

    return {
        "active": True,
        "title": properties.title or "",
        "artist": properties.artist or "",
        "album": properties.album_title or "",
        "albumArtist": properties.album_artist or "",
        "trackNumber": properties.track_number or 0,
        "status": status_name,
        "statusCode": status_code,
    }

# ================================================
# CREATE STATE KEY
# ================================================
def create_state_key(media):
    return json.dumps(media, sort_keys=True, ensure_ascii=False)

# ================================================
# MONITOR
# ================================================
async def monitor():
    global last_state
    send({"event": "ready"})

    while True:
        try:
            media = await get_media_state()
            state_key = create_state_key(media)
            if state_key != last_state:
                last_state = state_key
                send({"event": "media", "data": media})
        except Exception as error:
            send({"event": "error", "error": str(error)})
            await asyncio.sleep(0.5)

# ================================================
# MAIN
# ================================================
async def main():
    try:
        await monitor()
    except asyncio.CancelledError:
        pass
    except KeyboardInterrupt:
        pass
    except Exception as error:
        send({"event": "error", "error": str(error)})
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
