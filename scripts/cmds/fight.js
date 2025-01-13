const axios = require('axios');

// Define a sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// To keep track of ongoing fights
const ongoingFights = new Map();

module.exports = {
  config: {
    name: "fight",
    aliases: ['fight'],
    version: "2.0",
    author: "Rifat",
    countDown: 5,
    role: 0,
    category: "game",
    shortDescription: {
      en: "Challenge another player to a fight or stop an ongoing fight!",
    },
    longDescription: {
      en: "Two players fight until one of them is knocked out, or the fight is stopped. Bet money and see who wins!",
    },
    guide: {
      en: `
Usage:
- {pn} <@opponent> <bet amount> - Start a fight
- {pn} stop - Stop an ongoing fight
`,
    },
  },

  onStart: async function ({ message, event, usersData, args }) {
    const { senderID, mentions, threadID } = event;

    // Handle the "stop" command
    if (args[0] && args[0].toLowerCase() === "stop") {
      if (!ongoingFights.has(threadID)) {
        return message.reply("No fight is currently ongoing in this thread.");
      }

      const fightData = ongoingFights.get(threadID);
      ongoingFights.delete(threadID); // End the fight

      const { player1, player2, health1, health2, betAmount } = fightData;
      const winner = health1 > health2 ? "Player 1" : "Player 2";
      const loser = winner === "Player 1" ? "Player 2" : "Player 1";
      const winnerID = winner === "Player 1" ? player1.id : player2.id;
      const loserID = winner === "Player 1" ? player2.id : player1.id;

      // Distribute winnings
      const winnings = betAmount * 2;
      await usersData.set(winnerID, { money: (parseFloat(await usersData.get(winnerID).money) + winnings).toString() });
      await usersData.set(loserID, { money: (parseFloat(await usersData.get(loserID).money) - betAmount).toString() });

      return message.reply(`
🎮 **Fight Stopped!**
🎉 **${winner} wins the interrupted fight!**
💰 ${winner} earned **$${winnings}**.
📜 **Final Health Stats:**
- Player 1: ${health1} HP
- Player 2: ${health2} HP
`);
    }

    // Start a new fight
    if (Object.keys(mentions).length === 0) {
      return message.reply("You need to tag someone to challenge them to a fight!");
    }

    const opponentID = Object.keys(mentions)[0];
    if (opponentID === senderID) {
      return message.reply("You can't fight yourself! Well, you *could*, but it would be awkward.");
    }

    const betInput = args[1];
    if (!betInput || !/^\d+(\.\d+)?$/.test(betInput)) {
      return message.reply("Please specify a valid bet amount.");
    }

    const betAmount = parseFloat(betInput);

    const player1 = await usersData.get(senderID);
    const player2 = await usersData.get(opponentID);

    let balance1 = parseFloat(player1.money || "0");
    let balance2 = parseFloat(player2.money || "0");

    if (balance1 < betAmount) {
      return message.reply("You don't have enough money for this bet.");
    }

    if (balance2 < betAmount) {
      return message.reply("Your opponent doesn't have enough money for this bet.");
    }

    if (ongoingFights.has(threadID)) {
      return message.reply("A fight is already ongoing in this thread. Use `{pn} stop` to end it first.");
    }

    // Initialize fight data
    let health1 = 100;
    let health2 = 100;
    let turn = 1;

    const moves = [
      { name: "Punch", minDamage: 5, maxDamage: 25 },
      { name: "Kick", minDamage: 5, maxDamage: 25 },
      { name: "Headbutt", minDamage: 5, maxDamage: 25 },
      { name: "Body Slam", minDamage: 5, maxDamage: 25 },
      { name: "Uppercut", minDamage: 5, maxDamage: 25 },
    ];

    const getRandomDamage = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Store fight data
    ongoingFights.set(threadID, { player1: { id: senderID, health: health1 }, player2: { id: opponentID, health: health2 }, health1, health2, betAmount });

    let fightLog = `🎮 **Fight Log** 🎮\n\n`;

    while (health1 > 0 && health2 > 0) {
      if (!ongoingFights.has(threadID)) {
        return; // Fight was stopped
      }

      const move = moves[Math.floor(Math.random() * moves.length)];
      const damage = getRandomDamage(move.minDamage, move.maxDamage);

      if (turn === 1) {
        health2 -= damage;
        health2 = Math.max(0, health2);
        fightLog += `👊 Player 1 used **${move.name}** and dealt **${damage}** damage! Opponent's health: ${health2}\n`;
        turn = 2;
      } else {
        health1 -= damage;
        health1 = Math.max(0, health1);
        fightLog += `🤜 Player 2 used **${move.name}** and dealt **${damage}** damage! Opponent's health: ${health1}\n`;
        turn = 1;
      }

      await sleep(1000);
    }

    ongoingFights.delete(threadID); // End the fight

    const winner = health1 > 0 ? "Player 1" : "Player 2";
    const loser = winner === "Player 1" ? "Player 2" : "Player 1";
    const winnerID = winner === "Player 1" ? senderID : opponentID;
    const loserID = winner === "Player 1" ? opponentID : senderID;

    // Distribute winnings
    const winnings = betAmount * 2;
    await usersData.set(winnerID, { money: (parseFloat(await usersData.get(winnerID).money) + winnings).toString() });
    await usersData.set(loserID, { money: (parseFloat(await usersData.get(loserID).money) - betAmount).toString() });

    fightLog += `\n🎉 **${winner} wins the fight!** 🎉\n`;
    fightLog += `💰 ${winner} earned **$${winnings}**!\n`;

    message.reply(fightLog);
  },
};