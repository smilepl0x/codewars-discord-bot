const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token, clientId, guildId } = require("./config.json");

const commands = [
  {
    name: "cw",
    description: "Get Codewars users or challenges",
    options: [
      {
        name: "user",
        description: "Get user info",
        type: 1,
        options: [{ name: "username", description: "The user to get", type: 3 }],
      },
    ],
  },
];

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
