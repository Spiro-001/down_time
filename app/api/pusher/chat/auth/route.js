import { pusherServer } from "@/lib/pusher";
import prisma from "@/prisma/client";
import { OutputFetch } from "@/utils/Output";
import { parsePusher } from "@/utils/parsePusher";

export const POST = async (req, res) => {
  try {
    const data = await parsePusher(req.body);
    const { id, chatId } = data;

    // console.log(`GET user @ id: ${id}`);
    console.log(
      OutputFetch("GET", "chat", [`id: ${chatId}`], "/api/pusher/chat/auth")
    );
    const chatData = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });
    const usersAllowed = [chatData.users[0].userId, chatData.users[1].userId];
    if (usersAllowed.includes(id)) {
      const socketId = data.socket_id;
      const channel = data.channel_name;
      const presenceData = {
        user_id: socketId,
        user_info: {
          id,
          chat: chatData,
        },
      };
      // console.log(
      //   `Pusher @ AUTH [SOCKET_ID: ${socketId}, CHANNEL: ${channel}]`
      // );
      console.log(
        OutputFetch(
          "Pusher",
          "",
          [`AUTH [SOCKET_ID: ${socketId}, CHANNEL: ${channel}]`],
          "/api/pusher/chat/auth"
        )
      );
      const authResponse = pusherServer.authorizeChannel(
        socketId,
        channel,
        presenceData
      );
      return new Response(JSON.stringify(authResponse), { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify("error"), { status: 403 });
  }
};
