import { Context, NarrowedContext } from "telegraf";
import { CallbackQuery, Message, Update } from "typegram";

interface CommandCallbackContext
  extends NarrowedContext<
    Context<Update>,
    {
      message: Update.New & Update.NonChannel & Message.TextMessage;
      update_id: number;
    }
  > {}

interface RegexCallbackContext
  extends NarrowedContext<
    Context<Update> & {
      match: RegExpExecArray;
    },
    Update.CallbackQueryUpdate<CallbackQuery>
  > {}

export { CommandCallbackContext, RegexCallbackContext };
