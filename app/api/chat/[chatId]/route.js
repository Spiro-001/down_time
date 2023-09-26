import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";
import { OutputFetch } from "@/utils/Output";

export const DELETE = async (req, { params }) => {
  const { chatId } = params;
  try {
    // console.log(`GET chat @ id: ${chatId}`);
    console.log(
      OutputFetch("GET", "chat", [`id: ${chatId}`], "/api/chat/[chatId]")
    );
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      select: {
        users: {
          select: {
            users: {
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
    console.log(
      OutputFetch("DELETE", "chat", [`id: ${chatId}`], "/api/chat/[chatId]")
    );
    // console.log(`DELETE chat @ id: ${chatId}`);
    chat.users.forEach((user) => {
      console.log(
        OutputFetch(
          "Pusher",
          "",
          [toPusherKey(`user:${user.users.id}:delete-chat`)],
          "/api/chat/[chatId]"
        )
      );
      console.log(
        OutputFetch(
          "Pusher",
          "",
          [toPusherKey(`user:${user.users.id}:update-chat`)],
          "/api/chat/[chatId]"
        )
      );
    });
    // console.log(
    //   `Pusher @ ${toPusherKey(`user:${chat.users[0].users.id}:delete-chat`)}`
    // );
    // console.log(
    //   `Pusher @ ${toPusherKey(`user:${chat.users[1].users.id}:delete-chat`)}`
    // );
    // console.log(
    //   `Pusher @ ${toPusherKey(`user:${chat.users[0].users.id}:update-chat`)}`
    // );
    // console.log(
    //   `Pusher @ ${toPusherKey(`user:${chat.users[1].users.id}:update-chat`)}`
    // );
    pusherServer.trigger(
      toPusherKey(`user:${chat.users[0].users.id}:delete-chat`),
      "delete-chat",
      { ...chat, deletedChat }
    );
    pusherServer.trigger(
      toPusherKey(`user:${chat.users[1].users.id}:delete-chat`),
      "delete-chat",
      { ...chat, deletedChat }
    );
    pusherServer.trigger(
      toPusherKey(`user:${chat.users[0].users.id}:update-chat`),
      "update-chat",
      { ...chat, deletedChat }
    );
    pusherServer.trigger(
      toPusherKey(`user:${chat.users[1].users.id}:update-chat`),
      "update-chat",
      { ...chat, deletedChat }
    );
    return new Response(JSON.stringify(deletedChat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
