import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";

export const POST = (req, res) => {
  pusherClient.trigger(toPusherKey("presence-connection:active"), "", {});
};
