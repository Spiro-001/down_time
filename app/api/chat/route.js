import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";
import { OutputFetch } from "@/utils/Output";

export const PATCH = async (req, res) => {
  const { id, name } = await req.json();
  try {
    // console.log(`PATCH chat @ id: ${id}`);
    console.log(OutputFetch("PATCH", "chat", [`id: ${id}`], "/api/chat"));
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
    console.log(
      OutputFetch(
        "Pusher",
        "",
        [toPusherKey(`chat:${id}:update_chat`)],
        "/api/chat"
      )
    );
    console.log(
      OutputFetch(
        "Pusher",
        "",
        [toPusherKey(`user:${updatedChat.users[0].userId}:update_chat`)],
        "/api/chat"
      )
    );
    console.log(
      OutputFetch(
        "Pusher",
        "",
        [toPusherKey(`user:${updatedChat.users[1].userId}:update_chat`)],
        "/api/chat"
      )
    );
    // console.log(`Pusher @ ${toPusherKey(`chat:${id}:update_chat`)}`);
    // console.log(
    //   `Pusher @ ${toPusherKey(
    //     `user:${updatedChat.users[0].userId}:update_chat`
    //   )}`
    // );
    // console.log(
    //   `Pusher @ ${toPusherKey(
    //     `user:${updatedChat.users[1].userId}:update_chat`
    //   )}`
    // );
    pusherServer.trigger(
      toPusherKey(`chat:${id}:update_chat`),
      "update_chat",
      updatedChat
    );
    pusherServer.trigger(
      toPusherKey(`user:${updatedChat.users[0].userId}:update_chat`),
      "update_chat",
      updatedChat
    );
    pusherServer.trigger(
      toPusherKey(`user:${updatedChat.users[1].userId}:update_chat`),
      "update_chat",
      updatedChat
    );
    return new Response(JSON.stringify(updatedChat), { status: 200 });
  } catch (error) {
    console.log(error);
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
    // console.log(`POST chat @ id: ${chat.id}`);
    console.log(OutputFetch("POST", "chat", [`id: ${chat.id}`]));

    const chatUser = await prisma.chatUser.createMany({
      data: [
        { userId: users[0].id, chatId: chat.id },
        { userId: users[1].id, chatId: chat.id },
      ],
    });
    // console.log(`POST chatUser @ userId: ${users[0].id}`);
    // console.log(`POST chatUser @ userId: ${users[1].id}`);
    console.log(OutputFetch("POST", "chatUser", [`userId: ${users[0].id}`]));
    console.log(OutputFetch("POST", "chatUser", [`userId: ${users[1].id}`]));

    // console.log(`Pusher @ ${toPusherKey(`user:${users[0].id}:add-chat`)}`);
    // console.log(`Pusher @ ${toPusherKey(`user:${users[1].id}:add-chat`)}`);
    console.log(
      OutputFetch("Pusher", "", [toPusherKey(`user:${users[0].id}:add-chat`)])
    );
    console.log(
      OutputFetch("Pusher", "", [toPusherKey(`user:${users[1].id}:add-chat`)])
    );
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
