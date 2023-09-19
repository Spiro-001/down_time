import prisma from "@/prisma/client";

export const GET = async (req, { params }) => {
  const { chatId } = params;
  try {
    const data = await prisma.chat.findFirst({
      where: {
        id: chatId,
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        messages: {
          include: {
            author: true,
          },
        },
      },
    });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("error", { status: 500 });
  }
};
