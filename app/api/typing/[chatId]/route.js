import { pusherServer } from "@/lib/pusher";
import { OutputFetch } from "@/utils/Output";
import { toPusherKey } from "@/utils/toPusherKey";

export const POST = async (req, { params }) => {
  const { chatId } = params;
  const { userId, typing } = await req.json();
  try {
    // console.log(`Pusher @ ${toPusherKey(`user:${chatId}:typing_message`)}`);
    console.log(
      OutputFetch(
        "Pusher",
        "",
        [toPusherKey(`user:${chatId}:typing_message`)],
        "/api/typiing/[chatId]"
      )
    );
    pusherServer.trigger(
      toPusherKey(`user:${chatId}:typing_message`),
      "typing_message",
      {
        userId,
        typing,
      }
    );
    return new Response(JSON.stringify(true), { status: 200 });
  } catch (error) {
    return new Response("error", { status: 500 });
  }
};
