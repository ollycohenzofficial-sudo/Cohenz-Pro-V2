module.exports = {
    name: 'menu',
    alias: ['help', 'mode', 'all', 'bot'],
    async start(m, { text, command, isCreator, conn, participants }) {
        
        // 1. AUTO-REPLY LOGIC
        if (command === 'bot') {
            return m.reply("Yo! I'm Cohenz Pro Bot. Ready to work. Type .menu for my commands.");
        }

        // 2. MENTION ALL (@everyone)
        if (command === 'all') {
            if (!m.isGroup) return m.reply("This is a group-only command!");
            let users = participants.map(u => u.id);
            let announcement = text || "Attention everyone!";
            return conn.sendMessage(m.chat, { text: `📢 *ANNONCEMENT*\n\n${announcement}`, mentions: users });
        }

        // 3. MODE LOGIC
        if (command === 'mode') {
            if (!isCreator) return m.reply("Owner only! This is restricted to Musaasizi Marvin.");
            global.public_mode = (text === 'public');
            return m.reply(`✅ *Bot Status:* ${global.public_mode ? 'PUBLIC' : 'PRIVATE'}`);
        }

        // 4. THE FULL MENU
        let menuMsg = `🎵 *COHENZ PRO V2* 🎵\n` +
            `*Status:* ${global.public_mode ? 'Public' : 'Private'}\n\n` +
            `*--- ADMIN TOOLS ---*\n` +
            `• .kick [tag/reply]\n` +
            `• .promote [tag/reply]\n` +
            `• .warn [tag/reply]\n` +
            `• .antibad [on/off]\n` +
            `• .all [message]\n\n` +
            `*--- AI & MEDIA ---*\n` +
            `• .gemini [question]\n` +
            `• .play [song name]\n` +
            `• .video [link]\n` +
            `• .removebg [reply image]\n\n` +
            `*--- SYSTEM ---*\n` +
            `• .mode [public/private]\n` +
            `• .ping`;
        m.reply(menuMsg);
    }
};
