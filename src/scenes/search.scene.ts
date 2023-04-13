import { Markup } from "telegraf";
import {
  Canteen,
  CommandCallbackContext,
  RegexCallbackContext,
} from "../types";
import { arrayToChunks, dateToString } from "../utils";
import OpenMensa from "../openmensa";

const openMensa = new OpenMensa();
const _canteensPerPage = 10;

const message = (page: number, query?: string) => {
  // page is 0-indexed
  page = page + 1;

  if (query) {
    return `Suche nach ${query} auf Seite ${page}`;
  }

  return `Suche alle Mensen auf Seite ${page}`;
};

const keyboard = (page: number, canteens: Canteen[], query?: string) => {
  const canteenButtons = canteens.map((canteen) => {
    return {
      text: canteen.name,
      callback_data: `canteen:${canteen.id}:${dateToString(
        new Date()
      )}:${page}:${query || ""}`,
    };
  });

  return Markup.inlineKeyboard([
    ...arrayToChunks(canteenButtons, 2),
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

const filterCanteens = (canteen: Canteen, query: string) => {
  query = query.toLowerCase();

  return (
    canteen.name.toLowerCase().includes(query) ||
    canteen.address.toLowerCase().includes(query) ||
    canteen.city.toLowerCase().includes(query)
  );
};

const cmd = async (ctx: CommandCallbackContext) => {
  const query = ctx.message.text.split(" ").slice(1).join(" ");

  console.log(query);

  if (!query) return ctx.reply("Bitte gib einen Suchbegriff ein!");

  let canteens = await openMensa.getCanteens();

  canteens = canteens.filter((canteen) => filterCanteens(canteen, query));

  if (canteens.length === 0) return ctx.reply("Keine Mensen gefunden!");

  // get canteens for page
  canteens = canteens.slice(0, _canteensPerPage);

  const msg = message(0, query);
  const replyMarkup = keyboard(0, canteens, query);

  ctx.reply(msg, replyMarkup);
};

const action = async (ctx: RegexCallbackContext) => {
  const [_, pageString, query] = ctx.match;

  const page = Number(pageString);

  // check if page is out of range
  if (page < 0) return ctx.answerCbQuery("Keine vorherigen Mensen gefunden!");

  let canteens = await openMensa.getCanteens();

  if (query) {
    canteens = canteens.filter((canteen) => filterCanteens(canteen, query));
  }

  if (canteens.length === 0) return ctx.answerCbQuery("Keine Mensen gefunden!");

  // check if page is out of range
  if (page > Math.ceil(canteens.length / _canteensPerPage) - 1)
    return ctx.answerCbQuery("Keine weiteren Mensen gefunden!");

  // get canteens for page
  canteens = canteens.slice(
    page * _canteensPerPage,
    (page + 1) * _canteensPerPage
  );

  const msg = message(page, query);
  const replyMarkup = keyboard(page, canteens, query);

  ctx.editMessageText(msg, replyMarkup);
};

export { cmd, action };
