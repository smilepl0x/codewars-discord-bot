const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const { token } = require("./config.json");
const axios = require("axios").default;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "cw") {
    if (interaction.options.getSubcommand() === "user") {
      const username = interaction.options.getString("username");
      try {
        const response = await axios.get(
          `https://www.codewars.com/api/v1/users/${username}`
        );
        const {
          data: {
            honor,
            ranks: { overall } = {},
            codeChallenges: { totalCompleted } = {},
          } = {},
        } = response;
        if (username && overall && honor && totalCompleted) {
          interaction.reply(
            `${username} is ranked ${overall.name} overall and has a total of ${honor} honor with ${totalCompleted} completed katas.`
          );
        } else {
          throw new Error();
        }
      } catch (e) {
        console.log(e);
        interaction.reply("Err... Something went wrong.");
      }
    }
  }
});

client.login(token);
