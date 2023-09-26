import prisma from "@/prisma/client";

export const GET = async (req, { params }) => {
  const { chatId } = params;
  try {
    console.log(`GET chat @ id: ${chatId}`);
    const data = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
      },
    });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
