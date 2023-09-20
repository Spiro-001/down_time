import prisma from "@/prisma/client";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";

export const DELETE = async (req, { params }) => {
  const { chatId } = params;
  try {
    console.log("deleting");
    const deletedChat = await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });
    console.log(deletedChat);
    return new Response(JSON.stringify(deletedChat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
