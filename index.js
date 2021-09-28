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
            `\`\`\`diff\n--${username}--\n+ Ranking: ${overall.name}\n+ Honor: ${honor}\n+ Katas completed: ${totalCompleted}\`\`\``
          );
        } else {
          throw new Error();
        }
      } catch (e) {
        if (e.response.status === 404) {
          interaction.reply("Couldn't find that user.");
        } else {
          interaction.reply("Err... Something went wrong.");
        }
      }
    } else if (interaction.options.getSubcommand() === "challenge") {
      const challenge = interaction.options.getString("challenge"); // Will be ID or slug.
      try {
        const response = await axios.get(
          `https://www.codewars.com/api/v1/code-challenges/${challenge}`
        );
        const {
          data: { name, rank: { name: kyu } = {}, url, description } = {},
        } = response;
        if (name && kyu && url && description) {
          interaction.reply(
            `\`\`\`diff\n--${name}--\n+ Ranking: ${kyu}\n\nDescription: ${description.replace(/\`\`\`/g, "")}\`\`\`\n Attempt here: ${url}`
          );
        } else {
          throw new Error();
        }
      } catch (e) {
        if (e.response && e.response.status === 404) {
          interaction.reply("Couldn't find that challenge.");
        } else {
          interaction.reply("Err... Something went wrong.");
          console.log(e)
        }
      }
    }
  }
});

client.login(token);
