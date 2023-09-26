import prisma from "@/prisma/client";
import { OutputFetch } from "@/utils/Output";

export const GET = async (res, { params }) => {
  const { id } = params;
  try {
    // console.log(`GET user @ id: ${id}`);
    console.log(OutputFetch("GET", "user", [`id: ${id}`], "/api/user/[id]"));
    const data = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        membership: true,
        chats: {
          include: {
            chat: {
              include: {
                users: true,
              },
            },
          },
        },
        messages: true,
      },
    });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("error", { status: 500 });
  }
};
