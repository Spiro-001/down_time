import { loginIsRequiredServer } from "@/lib/auth";
import MarketPlace from "@/components/MarketPlace";
import React from "react";
import MemberType from "@/components/MemberType";
import TotalConnection from "@/components/TotalConnection";
import TotalMessage from "@/components/TotalMessage";
import Notification from "@/components/Notification";
import { getUserData } from "@/utils/getUserData";

const Chats = async () => {
  // Protected Routes
  await loginIsRequiredServer();
  const data = await getUserData();
  const { chats, messages, membership, session } = data;
  return (
    <div className="flex-1 flex flex-col bg-gray-100 px-8 py-8 gap-y-4">
      <div className="flex gap-x-4">
        <MemberType membership={membership} />
        <TotalConnection chats={chats} id={session.id} />
        <TotalMessage messages={messages} id={session.id} />
        <Notification />
      </div>
      <MarketPlace />
    </div>
  );
};

export default Chats;
