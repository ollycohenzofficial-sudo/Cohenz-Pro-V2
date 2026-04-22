module.exports = {
    name: 'mode',
    start(m, { text }) {
        if (!global.sudo.includes(m.sender.split('@')[0])) return m.reply("Owner only!");
        if (text === 'public') {
            global.public_mode = true;
            m.reply("Bot is now in PUBLIC mode.");
        } else if (text === 'private') {
            global.public_mode = false;
            m.reply("Bot is now in PRIVATE mode.");
        } else {
            m.reply("Usage: .mode public or .mode private");
        }
    }
};

