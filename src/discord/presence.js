// ================================================
// LIBRARIES
// ================================================
const {Client} = require('@xhayper/discord-rpc');
const config = require('@/config.json');

// ================================================
// VARIABLES
// ================================================
const RPC_TEXT = config.RPC_TEXT;

// ================================================
// DISCORD PRESENCE
// ================================================
class DiscordPresence {
    constructor(clientId) {
        this.clientId = clientId;
        this.client = null;
        this.connected = false;
    }

    async connect() {
        if (!this.clientId || this.clientId === 'YOUR_DISCORD_APPLICATION_ID') {
            throw new Error('Discord Application ID has not been configured.');
        }
        this.client = new Client({clientId: this.clientId});

        this.client.on('ready', () => {
            this.connected = true;
            console.log('✓ Discord RPC connected');
        });
        this.client.on('disconnected', () => {
            this.connected = false;
            console.log('⚠ Discord RPC disconnected')
        });
        this.client.on('error', (error) => {
            console.error('✗ Discord RPC error:', error.message || error);
        });

        await this.client.login();
    }

    async update(media) {
        if (!this.client || !this.connected) {return}
        if (!media || !media.active) {
            await this.clear();
            return;
        }

        const title = media.title || RPC_TEXT.LABELS.FALLBACKS.title;
        const artist = media.artist || RPC_TEXT.LABELS.FALLBACKS.artist;
        const status = RPC_TEXT.STATUS[media.status] || RPC_TEXT.STATUS.Unknown;

        await this.client.user.setActivity({
            details: title.slice(0, 128),
            state: `${status} • ${artist}`.slice(0, 128),
        });
    }

    async clear() {
        if (!this.client || !this.connected) {return}
        try {
            await this.client.user.setActivity({});
        } catch {}
    }

    async destroy() {
        if (!this.client) {return}
        try {await this.clear()} catch {}
        try {await this.client.destroy()} catch {}

        this.client = null;
        this.connected = false;
    }
}

module.exports = DiscordPresence;
