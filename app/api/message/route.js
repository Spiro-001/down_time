import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";
import prisma from "@/prisma/client";

export const POST = async (req, res) => {
  try {
    const { userId, message, chatId } = await req.json();
    const chatData = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });
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

    const otherUser =
      chatData.users[0].userId === userId
        ? chatData.users[1]
        : chatData.users[0];

    const updatedChat = await prisma.chatUser.update({
      where: {
        id: otherUser.id,
      },
      data: {
        notifications: {
          increment: 1,
        },
      },
    });

    console.log(
      `Pusher @ ${toPusherKey(
        `user:${
          chatData.users[0].userId === userId
            ? chatData.users[1].userId
            : chatData.users[0].userId
        }:add_message_notification`
      )}`
    );
    pusherServer.trigger(
      toPusherKey(`user:${chatId}:incoming_message`),
      "incoming_message",
      data
    );
    pusherServer.trigger(
      toPusherKey(
        `user:${
          chatData.users[0].userId === userId
            ? chatData.users[1].userId
            : chatData.users[0].userId
        }:add_message_notification`
      ),
      "add_message_notification",
      updatedChat
    );
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
