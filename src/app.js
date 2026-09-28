// ================================================
// LIBRARIES
// ================================================
const path = require('path');
const {spawn} = require('child_process');

const config = require('@/config.json');
const DiscordPresence = require('./discord/presence');

// ================================================
// VARIABLES
// ================================================
const discord = new DiscordPresence(config.BOT_ID);
const pythonExecutable = path.resolve(config.python.executable);
const pythonScript = path.resolve(config.python.script);

let pythonProcess = null;
let shuttingDown = false;
let pythonReady = false;

// ================================================
// START PYTHON
// ================================================
function startPython() {
    console.log('🐍 Starting Python media reader...');
    pythonProcess = spawn(
        pythonExecutable,
        [pythonScript],
        {windowsHide: true, stdio: ['ignore', 'pipe', 'pipe']}
    );

    pythonProcess.stdout.setEncoding('utf-8');
    let buffer = '';

    pythonProcess.stdout.on('data', async (chunk) => {
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) {continue}
            try {
                const message = JSON.parse(trimmed);
                await handlePythonMessage(message);
            } catch (error) {
                console.error('✗ Invalid Python message:', error.message);
            }
        }
    });

    pythonProcess.stderr.setEncoding('utf8');

    pythonProcess.stderr.on('data', (data) => {
        const message = data.trim();
        if (message) {
            console.error(`🐍 Python: ${message}`);
        }
    });

    pythonProcess.on('error', (error) => {
        console.error('✗ Failed to start Python:', error.message);
    });

    pythonProcess.on('close', (code) => {
        pythonReady = false;
        if (shuttingDown) {return}
        console.log(`⚠ Python media reader exited with code ${code}`);
        console.log('🔄 Restarting Python media reader...');
        setTimeout(startPython, 2000);
    });
}

// ================================================
// HANDLE PYTHON MESSAGE
// ================================================
async function handlePythonMessage(message) {
    switch (message.event) {
        case 'ready':
            pythonReady = true;
            console.log('✓ Python media reader connected');
            break;
        case 'media':
            await handleMedia(message.data);
            break;
        case 'error':
            console.error('✗ Python media error:', message.error);
            break;
        default:
            console.log('⚠ Unknown Python event:', message.event);
    }
}

// ================================================
// HANDLE MEDIA
// ================================================
async function handleMedia(media) {
    if (!media || !media.active) {
        console.log('');
        console.log('⏹ Media stopped');
        console.log('');
        await discord.clear();
        return;
    }

    console.log('');
    console.log('🎵 Media update');
    console.log('────────────────────────────');
    console.log(`🎶 Title:  ${media.title || 'Unknown'}`);
    console.log(`👤 Artist: ${media.artist || 'Unknown'}`);
    console.log(`💿 Album:  ${media.album || 'Unknown'}`);
    console.log(`▶️ Status: ${media.status || 'Unknown'}`);
    console.log(`#️⃣ Track:  ${media.trackNumber || 0}`);
    console.log('────────────────────────────');
    console.log('');

    await discord.update(media);
}

// ================================================
// START
// ================================================
async function start() {
    console.log('');
    console.log('🎵 Music Presence Discord');
    console.log('════════════════════════════');
    console.log('');
    console.log('🚀 Starting application...');
    console.log('');
    console.log(`🐍 Python: ${pythonExecutable}`);
    console.log(`📄 Script: ${pythonScript}`);
    console.log('');
    console.log('💬 Connecting to Discord...');

    await discord.connect();

    console.log('');
    console.log('✓ Discord connection established');
    console.log('');

    startPython();

    console.log('');
    console.log('🎧 Music Presence is running');
    console.log('────────────────────────────');
    console.log('');
}

// ================================================
// SHUTDOWN
// ================================================
async function shutdown(signal) {
    if (shuttingDown) {return}
    shuttingDown = true;

    console.log('');
    console.log(`🛑 Received ${signal}`);
    console.log('👋 Shutting down...');
    console.log('');

    if (pythonProcess) {
        pythonProcess.kill();
        pythonProcess = null;
    }

    await discord.destroy();

    console.log('✓ Music Presence stopped');
    process.exit(0);
}

// ================================================
// Process Lifecycle & Error Handling
// ================================================
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('SIGTERM', () => shutdown('SIGTERM'));


start().catch(
    async (error) => {
        console.error('');
        console.error('✗ Failed to start Music Presence');
        console.error(error.message || error);
        console.error('');
        await discord.destroy();
        process.exit(1);
    }
);
