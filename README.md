# 🎵 Music Presence Discord

Windows Media Player integration with Discord Rich Presence.

**Music Presence Discord** detects the media currently playing on your Windows system and displays it as a Discord Rich Presence activity. The project uses **Python** to read Windows media information and **Node.js** to handle the Discord Rich Presence connection.

> This project was created as a learning project to experiment with integrating **JavaScript/Node.js and Python** in the same application.

---

## ✨ Features

- 🎵 Detects currently playing Windows media
- 🎶 Displays the song title
- 👤 Displays the artist
- 💿 Displays the album
- ▶️ Detects playback status
- #️⃣ Detects the track number
- 🔄 Automatically updates Discord Rich Presence
- 🐍 Uses Python for Windows media detection
- 🟢 Uses Node.js for Discord Rich Presence
- 🔁 Automatically restarts the Python media reader if it exits unexpectedly
- 🛑 Gracefully shuts down the Python process and Discord connection

---

## 🛠️ Technologies

- **Node.js**
- **Python**
- **Discord Rich Presence**
- **Windows Global System Media Transport Controls**
- **@xhayper/discord-rpc**

---

## 📋 Requirements

Before running the project, make sure you have:

- [Node.js](https://nodejs.org/) installed
- Python 3 installed
- A Discord application with Rich Presence enabled
- Windows

The project was designed specifically for Windows because it uses the Windows Global System Media Transport Controls API.

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Nojus1225/Music-Presence-Discord.git
```

Enter the project directory:

```bash
cd Music-Presence-Discord
```

### 2. Install Node.js dependencies

```bash
npm install
```

### 3. Create the Python virtual environment

Navigate to the Python directory:

```bash
cd python
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Then install the required Python package(s) used by the media reader.

After setting up the Python environment, return to the project root:

```bash
cd ..
```

---

## ⚙️ Configuration

Before starting the application, configure `src/config.json`.

The configuration contains the Discord application ID and the paths required to start the Python media reader.

Example structure:

```json
{
    "BOT_ID": "YOUR_DISCORD_APPLICATION_ID",
    "python": {
        "executable": "./python/venv/Scripts/python.exe",
        "script": "./src/python/media_reader.py"
    }
}
```

Replace `YOUR_DISCORD_APPLICATION_ID` with the **Application ID** of your Discord application.

> Make sure the Python executable and script paths match your local project structure.

---

## ▶️ Running the Application

Once everything is configured, start the application from the project root:

```bash
npm run start
```

If everything is configured correctly, you should see output similar to:

```text
🎵 Music Presence Discord
════════════════════════════

🚀 Starting application...

💬 Connecting to Discord...
✓ Discord RPC connected

✓ Discord connection established

🐍 Starting Python media reader...

🎧 Music Presence is running
────────────────────────────
```

Start playing supported media on Windows and the application will automatically detect it and update your Discord Rich Presence.

---

## 🧪 Development

The project does not require a separate build step.

For development, simply run:

```bash
npm run start
```

The application runs directly from the source code.

---

## 📁 Project Structure

```text
Music-Presence-Discord/
├── src/
│   ├── discord/
│   │   └── presence.js
│   ├── python/
│   │   └── media_reader.py
│   ├── app.js
│   └── config.json
│
├── python/
│   └── venv/
│
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

### Main Components

**`index.js`**

Application entry point.

**`src/app.js`**

Controls the application lifecycle, starts the Python media reader, processes messages received from Python, and manages media updates.

**`src/python/media_reader.py`**

Reads Windows media information and sends JSON events to the Node.js application through stdout.

**`src/discord/presence.js`**

Handles the Discord Rich Presence connection and activity updates.

**`src/config.json`**

Contains the application configuration, including the Discord Application ID and Python paths.

---

## 🔄 How Node.js and Python Communicate

The project uses a simple process-based communication system.

Node.js starts the Python media reader as a child process. Python then sends JSON messages through `stdout`.

For example, Python can send events containing information about the current media:

```json
{
    "event": "media",
    "data": {
        "active": true,
        "title": "Example Song",
        "artist": "Example Artist",
        "album": "Example Album",
        "status": "Playing",
        "trackNumber": 1
    }
}
```

Node.js reads these messages, parses the JSON, and uses the received information to update Discord Rich Presence.

This was one of the main purposes of the project: learning how to connect a **Python process with a Node.js application**.

---

## 🛑 Stopping the Application

The application handles common process termination signals and shuts down the Python media reader and Discord connection cleanly.

Press:

```text
Ctrl + C
```

The application will shut down the running processes before exiting.

---

## 🐛 Troubleshooting

### Discord Application ID has not been configured

Make sure the Discord Application ID is correctly configured in `src/config.json`.

### Python script cannot be found

Check the `python.script` path in `src/config.json` and make sure the file exists.

### Python executable cannot be found

Check the `python.executable` path and make sure the virtual environment has been created correctly.

You can recreate the virtual environment with:

```bash
python -m venv python/venv
```

### Python dependency errors

Make sure the Python virtual environment is activated and the required dependencies are installed.

---

## 📜 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for more information.

---

## 👤 Author

Created by **Nojus**

GitHub: [@Nojus1225](https://github.com/Nojus1225)

---

## 💡 About the Project

Music Presence Discord started as a small learning project focused on experimenting with communication between **Node.js and Python**.

The project combines Windows media detection with Discord Rich Presence to create a simple desktop music presence.

The main goal was not to build a large application, but to gain practical experience with:

- Node.js child processes
- Python ↔ Node.js communication
- JSON-based process communication
- Windows media APIs
- Discord Rich Presence
- Process lifecycle management
- Graceful shutdown and error handling
