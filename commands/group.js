// Add this at the very top of group.js, outside the module.exports
let warnDatabase = {}; 

module.exports = {
    name: 'kick',
    alias: ['promote', 'warn', 'antibad'],
    async start(m, { text, command, conn, isBotAdmin, isAdmin }) {
        if (!m.isGroup) return m.reply("Groups only!");
        if (!isAdmin) return m.reply("Admin only!");
        
        const user = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
        if (!user || user.length < 10) return m.reply("Tag or reply to the troublemaker!");

        if (command === 'warn') {
            if (!isBotAdmin) return m.reply("Make me admin so I can kick if they reach the limit!");

            // Initialize warning count for this user in this group
            const warnId = `${m.chat}_${user}`;
            warnDatabase[warnId] = (warnDatabase[warnId] || 0) + 1;

            if (warnDatabase[warnId] >= global.warn_limit) {
                await m.reply(`🚫 @${user.split('@')[0]} has reached the limit (${global.warn_limit}) and will be removed!`, { mentions: [user] });
                await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
                delete warnDatabase[warnId]; // Reset after kick
            } else {
                await m.reply(`⚠️ @${user.split('@')[0]}, you've been warned!\n*Count:* ${warnDatabase[warnId]}/${global.warn_limit}`, { mentions: [user] });
            }
        }
        
        // ... (keep your existing kick/promote/antibad code here)
    }
};
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

