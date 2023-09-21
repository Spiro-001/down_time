import { pusherServer } from "@/lib/pusher";
import prisma from "@/prisma/client";
import { parsePusher } from "@/utils/parsePusher";

export const POST = async (req, res) => {
  try {
    const data = await parsePusher(req.body);
    const { id, username, email, membership } = data;

    const userData = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        chats: true,
        membership: true,
      },
    });

    switch (membership) {
      case "basic":
        if (userData.chats.length === 3)
          return new Response(
            JSON.stringify(`User has reached chat limit of 3 | ${membership}`),
            {
              status: 403,
            }
          );
      case "premium":
        if (userData.chats.length === 10)
          return new Response(
            JSON.stringify(`User has reached chat limit of 10 | ${membership}`),
            {
              status: 403,
            }
          );
      default:
        const socketId = data.socket_id;
        const channel = data.channel_name;
        const presenceData = {
          user_id: socketId,
          user_info: {
            id,
            username,
            email,
            membership,
          },
        };

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
