import { authOptions, loginIsRequiredServer } from "@/lib/auth";
import MarketPlace from "@/components/MarketPlace";
import React from "react";
import MemberType from "@/components/MemberType";
import TotalConnection from "@/components/TotalConnection";
import TotalMessage from "@/components/TotalMessage";
import { getServerSession } from "next-auth";
import Notification from "@/components/Notification";

const Chats = async () => {
  // Protected Routes
  await loginIsRequiredServer();
  const session = await getServerSession(authOptions);
  const res = await fetch(`http://localhost:3000/api/user/${session.id}`);
  const data = await res.json();
  const { chats, messages, membership } = data;
  return (
    <div className="flex-1 flex flex-col bg-gray-100 px-8 py-8 gap-y-4">
      <div className="flex gap-x-4">
        <MemberType membership={membership} />
        <TotalConnection chats={chats} />
        <TotalMessage messages={messages} />
        <Notification />
      </div>
      <MarketPlace />
    </div>
  );
};

export default Chats;
