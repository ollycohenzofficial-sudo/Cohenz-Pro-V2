const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidDecode
} = require("@whiskeysockets/baileys");
const fs = require('fs');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const path = require('path');
require('./config');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'session'));
    const { version } = await fetchLatestBaileysVersion();

    const client = makeWASocket({
        version,
        printQRInTerminal: false, // We will use pairing code instead
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.creds, makeCacheableSignalKeyStore)
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // --- PAIRING CODE LOGIC ---
    if (!client.authState.creds.registered) {
        let phoneNumber = global.sudo[0]; // Uses the number from your config.js
        if (!phoneNumber) {
            console.log("❌ Sudo number not found in config.js!");
        } else {
            setTimeout(async () => {
                let code = await client.requestPairingCode(phoneNumber);
                console.log(`\n\n🚀 YOUR PAIRING CODE: ${code}\n\n`);
            }, 3000);
        }
    }

    client.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.restartRequired) {
                console.log("♻️ Restarting...");
                startBot();
            } else if (reason === DisconnectReason.loggedOut) {
                console.log("❌ Logged out, please delete session folder and scan again.");
            } else {
                console.log("⚠️ Connection closed, reconnecting...");
                startBot();
            }
        } else if (connection === 'open') {
            console.log("✅ Cohenz Pro Bot is Online!");
        }
    });

    client.ev.on('creds.update', saveCreds);

    // Simple Command Handler
    client.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0];
            if (!m.message) return;
            const contents = JSON.stringify(m.message);
            const from = m.key.remoteJid;
            const type = Object.keys(m.message)[0];
            const body = (type === 'conversation') ? m.message.conversation : (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : '';
            
            if (body.startsWith(global.prefix)) {
                const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
                if (command === 'ping') {
                    await client.sendMessage(from, { text: 'Pong! 🤖 Bot is Active.' }, { quoted: m });
                }
            }
        } catch (err) {
            console.log(err);
        }
    });
}

startBot();

