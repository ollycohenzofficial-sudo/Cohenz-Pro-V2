module.exports = {
    name: 'kick',
    alias: ['promote', 'warn', 'antibad'],
    async start(m, { text, command, conn, isBotAdmin, isAdmin }) {
        if (!m.isGroup) return m.reply("This only works in groups!");
        if (!isAdmin) return m.reply("You must be a Group Admin to use this!");
        if (!isBotAdmin) return m.reply("Make the bot an Admin first!");

        const user = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
        if (!user || user.length < 10) return m.reply("Tag or reply to the user!");

        if (command === 'kick') {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            return m.reply("👢 Done. User has been removed.");
        }

        if (command === 'promote') {
            await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
            return m.reply("⭐ Done. User is now an Admin.");
        }

        if (command === 'warn') {
            return m.reply(`⚠️ @${user.split('@')[0]}, this is your official warning!`, { mentions: [user] });
        }

        if (command === 'antibad') {
            if (text === 'on') {
                global.antibad = true;
                return m.reply("🔞 Antibad-word is now ACTIVE.");
            } else {
                global.antibad = false;
                return m.reply("✅ Antibad-word is now DISABLED.");
            }
        }
    }
};
      
