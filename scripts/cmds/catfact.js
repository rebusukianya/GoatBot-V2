const axios = require('axios');
module.exports = {
	config: {
		name: "catfact",
		aliases: ["catfact"],
		version: "1.0",
		author: "MILAN",
		countDown: 5,
		role: 0,
		shortDescription: "Random Cat Fact",
		longDescription: "Random Cat Fact",
		category: "fun",
		guide: {
			en: "{pn}"
		},
	},

	onStart: async function ({ message, args, api, event }) {
		const axios = require("axios");
		let { messageID, threadID, senderID, body } = event;
		const response = args.join(" ");
		try {
			const res = await axios.get(`https://catfact.ninja/fact`);
			const fact = res.data.fact;
			api.sendMessage(`Cat Fact: ${fact}`, threadID , messageID);
		} catch (error) {
			api.sendMessage("An error occurred while making the API request.", threadID , messageID);
		}
	}
};
