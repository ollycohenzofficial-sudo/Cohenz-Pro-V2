// Database to keep track of warnings while the bot is running
let warnDatabase = {}; 

module.exports = {
    name: 'kick',
    alias: ['promote', 'warn', 'antibad'],
    async start(m, { text, command, conn, isBotAdmin, isAdmin }) {
        // --- 1. PRE-CHECKS (Permissions) ---
        if (!m.isGroup) return m.reply("Groups only!");
        if (!isAdmin) return m.reply("❌ You need to be an Admin to use this command.");
        
        // Find the target user (from tag, reply, or number)
        const user = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
        
        // For antibad, we don't need a target user, so we check that first
        if (command === 'antibad') {
            if (text === 'on') {
                global.antibad = true;
                return m.reply("🔞 *Antibad system:* ENABLED.");
            } else if (text === 'off') {
                global.antibad = false;
                return m.reply("✅ *Antibad system:* DISABLED.");
            } else {
                return m.reply("Usage: .antibad on OR .antibad off");
            }
        }

        // For kick, promote, and warn, we MUST have a target user
        if (!user || user.length < 10) return m.reply("Tag or reply to the user you want to manage!");

        // --- 2. COMMAND LOGIC ---

        // KICK
        if (command === 'kick') {
            if (!isBotAdmin) return m.reply("I need to be an Admin to kick people!");
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            return m.reply("👢 Done. User has been removed from the studio.");
        }

        // PROMOTE
        if (command === 'promote') {
            if (!isBotAdmin) return m.reply("I need to be an Admin to promote people!");
            await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
            return m.reply("⭐ Congrats! User is now an Admin.");
        }

        // WARN (The Count System)
        if (command === 'warn') {
            if (!isBotAdmin) return m.reply("Make me an Admin so I can kick users who reach the warning limit!");

            const warnId = `${m.chat}_${user}`;
            warnDatabase[warnId] = (warnDatabase[warnId] || 0) + 1;

            if (warnDatabase[warnId] >= global.warn_limit) {
                await m.reply(`🚫 @${user.split('@')[0]} reached the limit (${global.warn_limit}/${global.warn_limit}) and is being removed!`, { mentions: [user] });
                await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
                delete warnDatabase[warnId]; // Reset their count after they are gone
            } else {
                await m.reply(`⚠️ @${user.split('@')[0]}, you've been warned!\n*Warning Count:* ${warnDatabase[warnId]}/${global.warn_limit}`, { mentions: [user] });
            }
        }
    }
};
                
