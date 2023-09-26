import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";
import prisma from "@/prisma/client";
import { OutputFetch } from "@/utils/Output";

export const POST = async (req, res) => {
  try {
    const { userId, message, chatId } = await req.json();
    // console.log(`GET chat @ id: ${chatId}`);
    console.log(OutputFetch("GET", "chat", [`id: ${chatId}`], "/api/message"));
    const chatData = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });
    // console.log(`POST message @ author: ${userId}, chatId: ${chatId}`);
    console.log(
      OutputFetch(
        "POST",
        "message",
        [[`author: ${userId}`, `chatId: ${chatId}`]],
        "/api/message"
      )
    );
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

    // console.log(`PATCH chatUser @ id: ${otherUser.id}`);
    console.log(
      OutputFetch("PATCH", "chatUser", [`id: ${otherUser.id}`], "/api/message")
    );
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

    // console.log(
    //   `Pusher @ ${toPusherKey(
    //     `user:${
    //       chatData.users[0].userId === userId
    //         ? chatData.users[1].userId
    //         : chatData.users[0].userId
    //     }:add_message_notification`
    //   )}`
    // );
    console.log(
      OutputFetch(
        "Pusher",
        "",
        [
          toPusherKey(
            `user:${
              chatData.users[0].userId === userId
                ? chatData.users[1].userId
                : chatData.users[0].userId
            }:add_message_notification`
          ),
        ],
        "/api/message"
      )
    );
    // console.log(`Pusher @ ${toPusherKey(`chat:${chatId}:incoming_message`)}`);
    console.log(
      OutputFetch(
        "Pusher",
        "",
        [toPusherKey(`chat:${chatId}:incoming_message`)],
        "/api/message"
      )
    );
    pusherServer.trigger(
      toPusherKey(`chat:${chatId}:incoming_message`),
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
