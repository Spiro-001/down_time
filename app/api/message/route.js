import prisma from "@/prisma/client";

export const POST = async (req, res) => {
  try {
    const { userId, message, chatId } = await req.json();

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
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("error", { status: 500 });
  }
};
