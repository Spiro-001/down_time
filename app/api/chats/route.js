import prisma from "@/prisma/client";

export const GET = async (req, res) => {
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: "1",
      },
      include: {
        chats: {
          include: {
            chat: true,
          },
        },
      },
    });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response("error", { status: 500 });
  }
};
