import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";

export const POST = async (req, res) => {
  try {
    const { users } = await req.json();
    pusherServer.trigger(
      toPusherKey(`user:${users[0].id}:match-request`),
      "match-request",
      users
    );
    pusherServer.trigger(
      toPusherKey(`user:${users[1].id}:match-request`),
      "match-request",
      users
    );
    return new Response(JSON.stringify({}), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
