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

interface Canteen {
  id: number;
  name: string;
  city: string;
  address: string;
  coordinates: [number, number] | null;
}

interface CanteenSearchParams {
  ids?: number[];
  "near[lat]"?: number;
  "near[lng]"?: number;
  "near[dist]"?: number;
  hasCoordinates?: boolean;
}

interface Day {
  date: string;
  closed: false;
}

interface Meal {
  id: number;
  name: string;
  notes: string[];
  prices: {
    students: number;
    employees: number;
    others: number;
  };
  category: string;
}

export {
  CommandCallbackContext,
  RegexCallbackContext,
  Canteen,
  CanteenSearchParams,
  Day,
  Meal,
};
