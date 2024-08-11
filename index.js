const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options.js");
const token = "7324840767:AAGgyfKPPQCiBEu6wgddLQvdaoTHUid2ps8";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Guess the number I am thinking about between 0 and 9.`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Guess it now", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Greeting" },
    { command: "/info", description: "Get user information" },
    { command: "/game", description: "Play the game, guess the number" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://data.chpic.su/stickers/g/Gachimuchi_best/Gachimuchi_best_006.webp"
      );
      return bot.sendMessage(chatId, "Welcome to the club buddy!");
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `I know your name, ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(
      chatId,
      "Baran, I do not understand what you just wrote. Try again!"
    );
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Congrats! You guessed the number ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Sorry, but you did not guess the number ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
