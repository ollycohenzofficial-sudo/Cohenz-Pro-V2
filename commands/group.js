module.exports = {
    name: 'kick',
    alias: ['promote', 'warn', 'antibad'],
    async start(m, { text, command, conn, isBotAdmin, isAdmin }) {
        if (!m.isGroup) return m.reply("Groups only!");
        if (!isAdmin) return m.reply("You need to be an Admin!");
        if (!isBotAdmin) return m.reply("I need Admin rights!");

        const user = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
        if (!user || user.length < 10) return m.reply("Tag or reply to someone!");

        if (command === 'kick') {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            m.reply("👢 Kicked.");
        } else if (command === 'promote') {
            await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
            m.reply("⭐ Promoted.");
        } else if (command === 'warn') {
            m.reply(`⚠️ @${user.split('@')[0]}, final warning!`, { mentions: [user] });
        } else if (command === 'antibad') {
            global.antibad = (text === 'on');
            m.reply(`🔞 Antibad: ${global.antibad ? 'ON' : 'OFF'}`);
        }
    }
};

