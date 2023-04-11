import { config as dotenv } from "dotenv";

dotenv();

const TOKEN = process.env.TELEGRAM_ACCESS_TOKEN;

if (!TOKEN) throw new Error("No telegram access token defined!");

import { Telegraf } from "telegraf";

const bot = new Telegraf(TOKEN);

import {
  cmd as startCommand,
  action as startAction,
} from "./scenes/start.scene";

bot.start((ctx) => startCommand(ctx));
bot.action("start", (ctx) => startAction(ctx));

import {
  cmd as searchCommand,
  action as searchAction,
} from "./scenes/search.scene";

// search/page/query
bot.action(/search:(-?\d+):([\w\s]+)?/, (ctx) => searchAction(ctx));

// graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
