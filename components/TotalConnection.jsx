"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";
import React, { useEffect, useState } from "react";

const TotalConnection = ({ chats, id }) => {
  const [currentChat, setCurrentChat] = useState(chats.length);

  useEffect(() => {
    const deleteRequestHandler = (data) => {
      setCurrentChat((prev) => chats.length);
    };
    const updateRequestHandler = (data) => {
      setCurrentChat((prev) => prev + 1);
    };
    pusherClient.subscribe(toPusherKey(`user:${id}:delete-chat`));
    pusherClient.subscribe(toPusherKey(`user:${id}:add-chat`));
    pusherClient.bind("delete-chat", deleteRequestHandler);
    pusherClient.bind("add-chat", updateRequestHandler);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${id}:delete-chat`));
      pusherClient.unsubscribe(toPusherKey(`user:${id}:add-chat`));
      pusherClient.unbind("delete-chat", deleteRequestHandler);
      pusherClient.unbind("add-chat", updateRequestHandler);
    };
  }, []);

  return (
    <div className="bg-white w-full max-w-[300px] p-4 flex flex-col gap-y-4 rounded-md shadow-sm">
      <span className="bg-red-100 w-fit rounded-md px-4 py-1 text-lg font-semibold">
        Total Friends
      </span>
      <div className="flex justify-between items-center">
        <span className="bg-purple-200 w-fit px-3 py-1 rounded-md">
          {currentChat}
        </span>
        <span>My Friends</span>
      </div>
    </div>
  );
};

export default TotalConnection;
