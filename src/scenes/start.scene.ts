import { Markup } from "telegraf";
import { CommandCallbackContext, RegexCallbackContext } from "../types";

const message = "Willkommen beim MensaBot!";

const keyboard = () => {
  return Markup.inlineKeyboard([
    [
      {
        text: "🔍 Suchen",
        callback_data: "search:0:",
      },
      {
        text: "⭐️ Favoriten",
        callback_data: "favorites",
      },
    ],
    [
      {
        text: "📝 Feedback",
        callback_data: "feedback",
      },
      {
        text: "⚙️ Einstellungen",
        callback_data: "settings",
      },
    ],
  ]);
};

const cmd = (ctx: CommandCallbackContext) => {
  const replyMarkup = keyboard();
  ctx.reply(message, replyMarkup);
};

const action = (ctx: RegexCallbackContext) => {
  const replyMarkup = keyboard();
  ctx.editMessageText(message, replyMarkup);
};

export { cmd, action };
