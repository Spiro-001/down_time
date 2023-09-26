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
      include: {
        users: true,
      },
    });
    pusherServer.trigger(
      toPusherKey(`chat:${id}:update_chat`),
      "update_chat",
      updatedChat
    );
    pusherServer.trigger(
      toPusherKey(`user:${users[0].userId}:update_chat`),
      "update_chat",
      updatedChat
    );
    pusherServer.trigger(
      toPusherKey(`user:${users[0].userId}:update_chat`),
      "update_chat",
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
      data: {
        name: `${users[0].username} & ${users[1].username}'s Room`,
      },
    });
    const chatUser = await prisma.chatUser.createMany({
      data: [
        { userId: users[0].id, chatId: chat.id },
        { userId: users[1].id, chatId: chat.id },
      ],
    });
    pusherServer.trigger(
      toPusherKey(`user:${users[0].id}:add-chat`),
      "add-chat",
      { ...chat, users: [users[0].id, users[1].id] }
    );
    pusherServer.trigger(
      toPusherKey(`user:${users[1].id}:add-chat`),
      "add-chat",
      { ...chat, users: [users[0].id, users[1].id] }
    );
    return new Response(
      JSON.stringify({
        chat: {
          ...chat,
          users: [{ userId: users[0].id }, { userId: users[1].id }],
        },
        chatId: chat.id,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
