import { CommandCallbackContext, RegexCallbackContext } from "../types";

const cmd = (ctx: CommandCallbackContext) => {
  ctx.reply("Hello!");
};

const action = (ctx: RegexCallbackContext) => {};

export { cmd, action };
