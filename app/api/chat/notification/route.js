import { pusherServer } from "@/lib/pusher";
import prisma from "@/prisma/client";
import { toPusherKey } from "@/utils/toPusherKey";

export const PATCH = async (req, res) => {
  const { user, chatId } = await req.json();
  try {
    const chatUser = await prisma.chatUser.findFirst({
      where: {
        userId: user,
        chatId,
      },
    });
    const updateChatUser = await prisma.chatUser.update({
      where: {
        id: chatUser.id,
      },
      data: {
        notifications: 0,
      },
    });
    console.log(
      `Pusher @ ${toPusherKey(`user:${user}:clear_message_notification`)}`
    );
    pusherServer.trigger(
      toPusherKey(`user:${user}:clear_message_notification`),
      "clear_message_notification",
      updateChatUser
    );
    return new Response(JSON.stringify(updateChatUser), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
