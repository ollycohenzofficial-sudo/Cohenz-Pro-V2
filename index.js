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

global.warnDatabase = {};

async function startBot() {
    // --- 1. AUTOMATIC SESSION RESTORE ---
    // If the folder is missing but you have a SESSION_ID secret, recreate it
    if (!fs.existsSync('./session/creds.json') && process.env.SESSION_ID) {
        if (!fs.existsSync('./session')) fs.mkdirSync('./session');
        const decodedCreds = Buffer.from(process.env.SESSION_ID, 'base64').toString('utf-8');
        fs.writeFileSync('./session/creds.json', decodedCreds);
        console.log("✅ Session restored from Hugging Face Secrets!");
    }

    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'session'));
    const { version } = await fetchLatestBaileysVersion();

    const client = makeWASocket({
        version,
        printQRInTerminal: false, 
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.creds, makeCacheableSignalKeyStore)
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // --- 2. PAIRING CODE LOGIC ---
    if (!client.authState.creds.registered) {
        let phoneNumber = global.sudo[0]; 
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
                console.log("❌ Logged out, please delete session folder.");
            } else {
                console.log("⚠️ Connection closed, reconnecting...");
                startBot();
            }
        } else if (connection === 'open') {
            console.log("✅ Cohenz Pro Bot is Online!");
            
            // --- 3. SESSION ID GENERATOR ---
            // This prints the code you need to copy into Hugging Face Secrets
            try {
                const credsPath = path.join(__dirname, 'session', 'creds.json');
                if (fs.existsSync(credsPath)) {
                    const credsData = fs.readFileSync(credsPath);
                    const sessionID = Buffer.from(credsData).toString('base64');
                    console.log(`\n\n📦 YOUR SESSION_ID (Copy this to Secrets):\n\n${sessionID}\n\n`);
                }
            } catch (e) {
                console.log("Failed to generate Session ID string:", e);
            }
        }
    });

    client.ev.on('creds.update', saveCreds);

    client.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0];
            if (!m || !m.message) return;
            
            const from = m.key.remoteJid;
            const isGroup = from.endsWith('@g.us');
            const sender = m.key.participant || m.key.remoteJid;
            const type = Object.keys(m.message)[0];
            
            const body = (type === 'conversation') ? m.message.conversation : 
                         (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                         (type === 'imageMessage') ? m.message.imageMessage.caption : 
                         (type === 'videoMessage') ? m.message.videoMessage.caption : '';

            const metadata = isGroup ? await client.groupMetadata(from) : {};
            const participants = isGroup ? metadata.participants : [];
            const admins = isGroup ? participants.filter(v => v.admin !== null).map(v => v.id) : [];
            const isBotAdmin = isGroup ? admins.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') : false;
            const isAdmin = isGroup ? admins.includes(sender) : false;
            const isCreator = global.sudo.includes(sender.split('@')[0]);

            const badWords = ["fuck", "pussy", "dick", "nude", "sex", "gay"]; 
            if (global.antibad && isGroup && !isAdmin && badWords.some(word => body.toLowerCase().includes(word))) {
                await client.sendMessage(from, { delete: m.key });
                const warnId = `${from}_${sender}`;
                global.warnDatabase[warnId] = (global.warnDatabase[warnId] || 0) + 1;
                if (global.warnDatabase[warnId] >= global.warn_limit) {
                    await client.sendMessage(from, { text: `🚫 Limit reached. Removing @${sender.split('@')[0]}...`, mentions: [sender] });
                    await client.groupParticipantsUpdate(from, [sender], 'remove');
                    delete global.warnDatabase[warnId];
                } else {
                    await client.sendMessage(from, { text: `⚠️ Bad word detected! @${sender.split('@')[0]}\n*Warning:* ${global.warnDatabase[warnId]}/${global.warn_limit}`, mentions: [sender] });
                }
                return; 
            }

            if (body.toLowerCase() === 'bot') {
                return await client.sendMessage(from, { text: "I'm online! Type *.menu* to check my commands." }, { quoted: m });
            }

            if (body.startsWith(global.prefix)) {
                const command = body.slice(global.prefix.length).trim().split(/ +/).shift().toLowerCase();
                const text = body.slice(global.prefix.length + command.length).trim();
                const args = text.split(/ +/);

                const cmdPath = path.join(__dirname, 'commands', `${command}.js`);
                if (fs.existsSync(cmdPath)) {
                    const cmdFile = require(cmdPath);
                    await cmdFile.start(m, { client, conn: client, text, args, command, isCreator, isAdmin, isBotAdmin, participants, from });
                }
            }
        } catch (err) {
            console.log("Error in handler: ", err);
        }
    });
}

startBot();
               
