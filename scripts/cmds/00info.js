const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
	config: {
		name: "info",
		version: "1.0",
		author: "Rifat",
		countDown: 20,
		role: 0,
		shortDescription: { vi: "", en: "" },
		longDescription: { vi: "", en: "" },
		category: "owner",
		guide: { en: "" },
		envConfig: {}
	},
	onStart: async function ({ message }) {
		const authorName = "ʍʊɛɨɖ ʍʊʀֆǟʟɨռ ʀɨʄǟȶ";
		const ownAge = "_18+_";
		const messenger = "https://m.me/j/AbbCTo1VZ6TSDI6E/";
		const authorFB = "https://www.facebook.com/mueid.mursalin.rifat1";
		const authorNumber = "_01642057735";
		const Status = "🆂🅸🅽🅶🅻🅴";
		const urls = [
"https://images.app.goo.gl/5XG2KNzW4d8qr2p87",
"https://images.app.goo.gl/kbCue9GXfq3RYVrB8",
"https://images.app.goo.gl/TWYJKP1ZtU4ZReARA",
"https://images.app.goo.gl/YaV1zyah8Hs7o6P38"
];
		const link = urls[Math.floor(Math.random() * urls.length)];
		const now = moment().tz('Asia/Jakarta');
		const date = now.format('MMMM Do YYYY');
		const time = now.format('h:mm:ss A');
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime / 60) % 60);
		const hours = Math.floor((uptime / (60 * 60)) % 24);
		const days = Math.floor(uptime / (60 * 60 * 24));
		const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

		message.reply({
			body: `💫《 ⩸__𝐁𝐨𝐭 𝐀𝐧𝐝 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧__⩸ 》💫
\🤖彡𝐵𝑜𝑡 𝑁𝑎𝑚𝑒 : ⩸__${global.GoatBot.config.nickNameBot}__⩸
\👾彡𝐵𝑜𝑡 𝑆𝑦𝑠𝑡𝑒𝑚 𝑃𝑟𝑒𝑓𝑖𝑥 : ${global.GoatBot.config.prefix}
\💙彡𝑂𝑤𝑛𝑒𝑟 𝑁𝑎𝑚𝑒 : ${authorName}
\📝彡𝐴𝑔𝑒  : ${ownAge}
\💕彡𝑅𝑒𝑙𝑎𝑡𝑖𝑜𝑛𝑆ℎ𝑖𝑝: ${Status}
\🌐彡𝑊𝑝 : ${authorNumber}
\🌍彡𝐹𝑎𝑐𝑒𝑏𝑜𝑜𝑘 𝐿𝑖𝑛𝑘 : ${authorFB}
\🗓彡𝐷𝑎𝑡𝑒 : ${date}
\⏰彡𝑁𝑜𝑤 𝑇𝑖𝑚𝑒 : ${time}
\🔰彡𝐴𝑛𝑦 𝐻𝑒𝑙𝑝 𝐶𝑜𝑛𝑡𝑎𝑐𝑡 :⩸__${messenger}__⩸
\📛彡𝐵𝑜𝑡 𝐼𝑠 𝑅𝑢𝑛𝑛𝑖𝑛𝑔 𝐹𝑜𝑟 : ${uptimeString}
 💀彡𝑻𝒈: https://t.me/mueidmursalinrifat
 🙂彡𝑰𝒏𝒔𝒕𝒂: https://www.instagram.com/mueidmursalinrifat?
 😃彡𝑪𝒂𝒑𝑪𝒖𝒕: mueidmursalinrifat
 🥴彡𝑻𝒊𝒌𝑻𝒐𝒌: https://www.tiktok.com/@mmrifat222?
 🥲彡𝒀𝒐𝒖𝑻𝒖𝒃𝒆: Nai🙂
\===============`,
			attachment: await global.utils.getStreamFromURL(link)
		});
	},
	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "info") {
			this.onStart({ message });
		}
	}
};
