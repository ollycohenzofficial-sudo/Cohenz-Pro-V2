require('dotenv').config(); 

global.ownername = "Musaasizi Marvin";
global.botname = "Cohenz Pro Bot";
global.sudo = ["256709913725"];
global.packname = "Cohenz Pro";
global.author = "iMac Recordz";
global.prefix = ".";

// AI Settings
global.gemini_api_key = process.env.GEMINI_API_KEY;
global.gemini_model = "gemini-1.5-flash";

module.exports = {
  sessionName: "session"
};

