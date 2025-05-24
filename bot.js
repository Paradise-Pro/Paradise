require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const applyLogs = require("discord-logs");
const handleEvents = require("./functions/handleEvents");
const handleCommands = require("./functions/handleCommands");
const checkGiveawayWinners = require("./functions/checkGiveawayWinners");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
  ],
});

applyLogs(client);
client.commands = new Collection();

handleEvents(client);
handleCommands(client);

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  setInterval(() => {
    checkGiveawayWinners(client);
  }, 60 * 1000);
});

console.log("📡 Attempting to log in the bot...");
client.login(process.env.DISCORD_BOT_TOKEN);
