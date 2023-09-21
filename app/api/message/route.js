import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";
import prisma from "@/prisma/client";

export const POST = async (req, res) => {
  try {
    const { userId, message, chatId } = await req.json();
    const data = await prisma.message.create({
      include: {
        author: true,
      },
      data: {
        userId,
        message,
        chatId,
      },
    });
    pusherServer.trigger(
      toPusherKey(`user:${chatId}:incoming_message`),
      "incoming_message",
      data
    );
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
