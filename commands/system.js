const { performance } = require('perf_hooks');

module.exports = {
    name: 'menu',
    alias: ['help', 'mode', 'ping', 'alive', 'all'],
    async start(m, { text, command, isCreator, conn, participants }) {
        
        // 1. PING COMMAND
        if (command === 'ping') {
            const start = performance.now();
            await m.reply("Testing speed...");
            const end = performance.now();
            return m.reply(`⚡ *Pong!* Latency: ${Math.round(end - start)}ms`);
        }

        // 2. ALIVE COMMAND
        if (command === 'alive') {
            return conn.sendMessage(m.chat, { 
                image: { url: 'https://files.catbox.moe/vpt36o.jpg' }, // You can change this link to your logo
                caption: `👋 Yo! *${global.botname}* is active.\n\n👤 *Owner:* ${global.ownername}\n📡 *Mode:* ${global.public_mode ? 'Public' : 'Private'}\n\n_Type .menu to start._`
            }, { quoted: m });
        }

        // 3. MENTION ALL
        if (command === 'all') {
            if (!m.isGroup) return m.reply("Groups only!");
            let users = participants.map(u => u.id);
            return conn.sendMessage(m.chat, { text: `📢 *Attention:*\n${text || 'No message'}`, mentions: users });
        }

        // 4. MODE & MENU
        if (command === 'mode') {
            if (!isCreator) return m.reply("Owner only!");
            global.public_mode = (text === 'public');
            return m.reply(`✅ Mode updated to: ${global.public_mode ? 'PUBLIC' : 'PRIVATE'}`);
        }

        let menu = `🎵 *COHENZ PRO V2* 🎵\n\n` +
            `*SYSTEM:* .ping, .alive, .menu, .mode\n` +
            `*AI:* .gemini [ask anything]\n` +
            `*GROUP:* .kick, .promote, .warn, .antibad, .all\n` +
            `*MEDIA:* .play, .video, .blur, .removebg`;
        m.reply(menu);
    }
};
