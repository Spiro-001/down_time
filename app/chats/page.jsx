import MyChats from "@/components/MyChats";
import SignOutButton from "@/components/SignOutButton";
import { authOptions, loginIsRequiredServer } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Chats = async () => {
  // Protected Routes
  await loginIsRequiredServer();

  return (
    <div>
      Chats
      <SignOutButton />
    </div>
  );
};

export default Chats;
