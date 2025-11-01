import { joinUrl } from "@hiredtobe/shared/utils";
import { Context } from "hono";

export const getStaticAsset = async (c: Context, filepath: string) =>
  new Request(joinUrl(new URL(c.req.url).origin, filepath));
