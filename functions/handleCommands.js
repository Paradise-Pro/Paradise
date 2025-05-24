const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

function getAllCommandFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllCommandFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith(".js")) {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

module.exports = (client) => {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = getAllCommandFiles(commandsPath);

  for (const file of commandFiles) {
    const command = require(file);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.warn(`⚠️ Η εντολή στο ${file} δεν έχει "data" ή "execute".`);
    }
  }
};
