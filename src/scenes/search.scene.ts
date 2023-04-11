import { Markup } from "telegraf";
import { CommandCallbackContext, RegexCallbackContext } from "../types";

const message = (page: number, query?: string) => {
  if (query) {
    return `Suche nach ${query} auf Seite ${page}`;
  }

  return `Suche alle Mensen auf Seite ${page}`;
};

const keyboard = (page: number, query?: string) => {
  return Markup.inlineKeyboard([
    [
      {
        text: "⬅️",
        callback_data: `search:${page - 1}:${query || ""}`,
      },
      {
        text: "➡️",
        callback_data: `search:${page + 1}:${query || ""}`,
      },
    ],
    [
      {
        text: "↩️ Zurück",
        callback_data: "start",
      },
    ],
  ]);
};

const cmd = (ctx: CommandCallbackContext) => {};

const action = (ctx: RegexCallbackContext) => {
  const [_, pageString, query] = ctx.match;

  const page = Number(pageString);

  // check if page is out of range
  if (page < 0) return ctx.answerCbQuery("Keine vorherigen Mensen gefunden!");

  const msg = message(page, query);
  const replyMarkup = keyboard(page, query);

  ctx.editMessageText(msg, replyMarkup);
};

export { cmd, action };
