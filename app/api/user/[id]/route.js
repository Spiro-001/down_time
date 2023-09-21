import prisma from "@/prisma/client";

export const GET = async (res, { params }) => {
  const { id } = params;
  try {
    const data = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        membership: true,
        chats: true,
        messages: true,
      },
    });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
