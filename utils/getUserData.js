import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cache } from "react";

export const getUserData = cache(async () => {
  const session = await getServerSession(authOptions);
  const res = await fetch(`http://localhost:3000/api/user/${session.id}`);
  const data = await res.json();
  data["session"] = session;
  return data;
});
