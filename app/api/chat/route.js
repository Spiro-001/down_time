import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";

export const PATCH = async (req, res) => {
  const { id, name } = await req.json();
  try {
    const updatedChat = await prisma.chat.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    console.log(updatedChat);
    pusherServer.trigger(
      toPusherKey(`user:${id}:update_chat`),
      "typing_message",
      updatedChat
    );
    return new Response(JSON.stringify(updatedChat), { status: 200 });
  } catch (error) {
    return new Response("error", { status: 500 });
  }
};
