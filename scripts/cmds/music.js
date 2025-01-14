const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const url = "https://sudio-server.onrender.com";

module.exports = {
  config: {
    name: "music",
    aliases: ["music"],
    version: "1.0",
    author: "Jsux",
    cooldown: 5,
    role: 0,
    category: "ai",
    guide: {
      ar: "Allahakbar",
    },
  },

  onStart: async function({ api, message, event, args }) {
    try {
      switch (args[0]) {
        case "lyrics": {
          if (!args[1]) return message.reply("Please provide a valid genre");
          const topic = args.slice(1).join(" ");
          const response = await axios.post(`${url}/lyrics`, { topic });
          return message.reply(response.data.lyrics);
        }

        default: {
          message.reaction("🤔", event.messageID);
          let response;

          if (event?.messageReply?.body) {
            const prompt = event.messageReply.body.slice(0, 4096);
            response = await axios.post(`${url}/compose`, {
              lyrics: prompt === "NONE" ? "[Instrumental]" : prompt,
              lyrics_strength: 0.55,
              prompt_strength: 0.65,
              prompt: args?.[0] ? args.join(" ") : "",
            });
          } else {
            if (!args[0]) return message.reply("Please provide a valid genre");
            const prompt = args.join(" ");
            response = await axios.post(`${url}/auto`, { topic: prompt });
          }

          const jobId = response.data.jobId;
          let check, attempts = 0;
          const maxAttempts = 10;
          const interval = 8000;

          while (attempts < maxAttempts) {
            check = await axios.get(`${url}/check/${jobId}`);
            if (check.data.finished) break;
            attempts++;
            if (attempts < maxAttempts) await new Promise(res => setTimeout(res, interval));
          }

          if (!check.data.audio) return message.reply("Failed to retrieve audio after multiple attempts.");

          const filePath = path.join(__dirname, `${uuid()}.mp3`);
          fs.writeFileSync(filePath, Buffer.from(check.data.audio, "base64"));
          const fileStream = fs.createReadStream(filePath);

          await message.reaction("✅", event.messageID);
          await message.reply({ body: check.data.lyrics, attachment: fileStream });

          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error(error);
      message.reply(`An error occurred: ${error.message}`);
    }
  },
};
