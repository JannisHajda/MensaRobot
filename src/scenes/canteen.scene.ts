import { Markup, TelegramError } from "telegraf";
import { CommandCallbackContext, Meal, RegexCallbackContext } from "../types";
import OpenMensa from "../openmensa";
import { dateToString } from "../utils";

const openMensa = new OpenMensa();

const message = (canteen: string, date: string, meals: Meal[]) => {
  let msg = `🌟 Tagesmenü für ${canteen} 🌟 \n`;
  msg += `📅 ${new Date(date).toLocaleDateString("de-DE")} \n\n`;

  for (const meal of meals) {
    msg += `🍽️ ${meal.name}\n`;
    if (meal.prices.students) {
      msg += `💰 ${meal.prices.students}€`;
    }

    if (meal.prices.employees) {
      msg += ` | ${meal.prices.employees}€`;
    }

    msg += "\n\n";
  }

  return msg;
};

const keyboard = (
  canteenId: number,
  date: string,
  searchPage: number,
  query?: string
) => {
  const today = new Date(date);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const tomorrowString = dateToString(tomorrow);
  const yesterdayString = dateToString(yesterday);

  return Markup.inlineKeyboard([
    [
      {
        text: "⬅️",
        callback_data: `canteen:${canteenId}:${yesterdayString}:${searchPage}:${
          query || ""
        }`,
      },
      {
        text: "🔄",
        callback_data: `canteen:${canteenId}:${date}:${searchPage}:${
          query || ""
        }`,
      },
      {
        text: "➡️",
        callback_data: `canteen:${canteenId}:${tomorrowString}:${searchPage}:${
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

const action = async (ctx: RegexCallbackContext) => {
  const [_, canteenIdString, date, searchPageString, query] = ctx.match;
  const canteenId = Number(canteenIdString);
  const searchPage = Number(searchPageString);

  const canteen = await openMensa.getCanteen(canteenId);

  if (!canteen) return ctx.answerCbQuery("Mensa nicht gefunden!");

  const meals = await openMensa.getMeals(canteenId, date);

  if (!meals) return ctx.answerCbQuery("Keine Angebote gefunden!");

  const msg = message(canteen.name, date, meals);
  const replyMarkup = keyboard(canteenId, date, searchPage, query);

  try {
    await ctx.editMessageText(msg, replyMarkup);
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
