import MarketPlace from "@/components/MarketPlace";
import MyChats from "@/components/MyChats";
import Nav from "@/components/Nav";
import SignOutButton from "@/components/SignOutButton";
import { authOptions, loginIsRequiredServer } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Chats = async () => {
  // Protected Routes
  await loginIsRequiredServer();

  return (
    <div className="flex-1 flex flex-col bg-gray-100 px-8 py-8 gap-y-4">
      <div className="flex gap-x-4">
        <div className="bg-white w-full max-w-[300px] p-4 flex flex-col">
          member type
        </div>
        <div className="bg-white w-full max-w-[300px] p-4 flex flex-col">
          total connection
        </div>
        <div className="bg-white w-full max-w-[300px] p-4 flex flex-col">
          total messages
        </div>
      </div>
      <MarketPlace />
    </div>
  );
};

export default Chats;
