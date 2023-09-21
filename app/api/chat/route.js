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

export const POST = async (req, res) => {
  const { users } = await req.json();
  try {
    const chat = await prisma.chat.create({
      data: {},
    });
    const chatUser = await prisma.chatUser.createMany({
      data: [
        { userId: users[0], chatId: chat.id },
        { userId: users[1], chatId: chat.id },
      ],
    });
    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
