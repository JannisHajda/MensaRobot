import { Markup, TelegramError } from "telegraf";
import { CommandCallbackContext, RegexCallbackContext } from "../types";

const message = (canteenId: number, date: string) => {
  return `Menü für Mensa ${canteenId} am ${date}`;
};

const keyboard = (
  canteenId: number,
  date: string,
  searchPage: number,
  query?: string
) => {
  return Markup.inlineKeyboard([
    [
      {
        text: "Refresh",
        callback_data: `canteen:${canteenId}:${date}:${searchPage}:${
          query || ""
        }`,
      },
    ],
    [
      {
        text: "↩️ Zurück",
        callback_data: `search:${searchPage}:${query || ""}`,
      },
    ],
  ]);
};

const cmd = (ctx: CommandCallbackContext) => {};

const action = (ctx: RegexCallbackContext) => {
  const [_, canteenIdString, date, searchPageString, query] = ctx.match;
  console.log(ctx.match);
  const canteenId = Number(canteenIdString);
  const searchPage = Number(searchPageString);

  const msg = message(canteenId, date);
  const replyMarkup = keyboard(canteenId, date, searchPage, query);

  try {
    ctx.editMessageText(msg, replyMarkup);
  } catch (error) {
    if (
      error instanceof TelegramError &&
      error.response.description ===
        "Bad Request: message is not modified: specified new message content and reply markup are exactly the same as a current content and reply markup of the message"
    )
      return ctx.answerCbQuery("Keine neuen Angebote gefunden!");
    else throw error;
  }
};

export { cmd, action };
