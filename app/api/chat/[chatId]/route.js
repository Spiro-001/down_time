import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";

export const DELETE = async (req, { params }) => {
  const { chatId } = params;
  try {
    console.log("deleting");
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      select: {
        users: {
          select: {
            user: {
              select: {
                id: true,
                membership: true,
                email: true,
                username: true,
              },
            },
          },
        },
      },
    });
    const deletedChat = await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });

    console.log(chat.users);

    pusherServer.trigger(
      toPusherKey(`user:${chat.users[0].user.id}:delete-chat`),
      "delete-chat",
      { ...chat, deletedChat }
    );
    pusherServer.trigger(
      toPusherKey(`user:${chat.users[1].user.id}:delete-chat`),
      "delete-chat",
      { ...chat, deletedChat }
    );
    return new Response(JSON.stringify(deletedChat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
