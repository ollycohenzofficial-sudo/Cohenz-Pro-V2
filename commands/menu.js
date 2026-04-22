module.exports = {
    name: 'menu',
    alias: ['help'],
    start(m) {
        let menuText = `🎵 *COHENZ PRO BOT MENU* 🎵\n\n` +
            `*AI COMMANDS:*\n` +
            `- .gemini [query]\n\n` +
            `*DOWNLOADER:*\n` +
            `- .play [song name]\n` +
            `- .video [url]\n\n` +
            `*EDITING:*\n` +
            `- .removebg (reply to photo)\n` +
            `- .blur (reply to photo)\n\n` +
            `*SYSTEM:*\n` +
            `- .mode [public/private]\n` +
            `- .ping`;
        m.reply(menuText);
    }
};

