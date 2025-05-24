const fs = require("fs");
const path = require("path");
const { registerEventHandlers } = require("../handlers/handleLogs");

module.exports = (client) => {
  const eventsPath = path.join(__dirname, "../events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`../events/${file}`);
    const eventName = file.split(".")[0];

    if (event.once) {
      client.once(eventName, (...args) => event.execute(...args, client));
    } else {
      client.on(eventName, (...args) => event.execute(...args, client));
    }
  }

  registerEventHandlers(client);
};
