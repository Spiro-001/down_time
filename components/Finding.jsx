"use client";

import React, { useEffect, useState } from "react";
import NewConnection from "./NewConnection";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";

const Finding = ({ userInfo, chats }) => {
  const [searching, setSearching] = useState(false);
  const handleClick = () => {
    document.getElementById("search-connection").showModal();
    setSearching(true);
  };

  useEffect(() => {
    const deleteRequestHandler = (data) => {
      setSearching(false);
    };
    pusherClient.subscribe(toPusherKey(`user:${userInfo.id}:update-chat`));
    pusherClient.bind("update-chat", deleteRequestHandler);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${userInfo.id}:update-chat`));
      pusherClient.unbind("update-chat", deleteRequestHandler);
    };
  }, []);

  return (
    <div>
      <button
        className="bg-white rounded-md px-4 py-2 font-bold"
        onClick={handleClick}
      >
        New Conversation
      </button>
      <dialog
        id="search-connection"
        className="w-full h-full justify-center bg-transparent items-center outline-none"
      >
        {searching && (
          <div className="w-full h-full flex justify-center bg-transparent items-center">
            <div className="mx-auto flex w-full h-fit max-w-[500px] min-h-[200px] bg-white px-4 pt-8 pb-2 rounded-md shadow-md">
              <div className="relative overflow-visible w-full h-full flex flex-col gap-y-4 justify-between">
                <NewConnection
                  userInfo={userInfo}
                  chats={chats}
                  setSearching={setSearching}
                />
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default Finding;
