require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const applyLogs = require("discord-logs");
const handleEvents = require("./functions/handleEvents");
const handleCommands = require("./functions/handleCommands");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent, 
  ],
});

applyLogs(client); 
client.commands = new Collection();

handleEvents(client);   
handleCommands(client);  

console.log("📡 Attempting to log in the bot...");
client.login(process.env.DISCORD_BOT_TOKEN);