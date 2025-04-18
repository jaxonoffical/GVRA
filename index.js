require("dotenv").config();
const { Client, Collection, GatewayIntentBits, REST, Routes } = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");

const { token, mongodb } = process.env;
const prefix = "?";


mongoose.connect(mongodb)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));
  
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();
client.prefixCommands = new Collection();
client.commandArray = [];

const handleEvents = async () => {
  const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));
  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));
  }
};

const handlePrefixCommands = async () => {
  try {
    const commandFiles = fs.readdirSync("./commands/prefix").filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/prefix/${file}`);
      client.commands.set(command.name, command);
    }
  } catch (error) {
    console.error("Error while handling prefix commands:", error.stack);
  }
};

const handleCommands = async () => {
  const commandFiles = fs.readdirSync("./commands/slash").filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/slash/${file}`);
    client.commands.set(command.data.name, command);
    client.commandArray.push(command.data.toJSON());
  }

  const clientId = "1362496654346813632";
  const guildId = "1362459122561188060";
  const rest = new REST({ version: "10" }).setToken(token);

  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: client.commandArray,
    });
    console.log("Slash commands uploaded successfully.");
  } catch (error) {
    console.error("Error uploading slash commands:", error.stack);
  }
};


client.handleEvents = handleEvents;
client.handlePrefixCommands = handlePrefixCommands;
client.handleCommands = handleCommands;

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (command) {
    try {
      command.execute(message, args);
    } catch (error) {
      console.error("Error executing command:", error.stack);
      message.reply("There was an error while executing that command.");
    }
  }
});
(async () => {
  await client.handleEvents();
  await client.handlePrefixCommands();
  await client.handleCommands();
})();

client.login(token);
