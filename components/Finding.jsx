"use client";

import React, { useEffect, useState } from "react";
import NewConnection from "./NewConnection";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";
import Image from "next/image";

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

  const handleCloseSearch = (e) => {
    e.stopPropagation();
    setSearching(false);
    document.getElementById("search-connection").close();
  };

  return (
    <div onClick={handleClick}>
      Click to find
      <dialog
        id="search-connection"
        className="w-full h-full flex justify-center bg-transparent items-center outline-none"
      >
        {searching && (
          <div className="flex w-full h-full max-w-[500px] max-h-[200px] bg-white px-4 pt-8 pb-2 rounded-md shadow-md">
            <div className="relative overflow-visible w-full h-full flex flex-col gap-y-4 justify-between">
              <NewConnection
                userInfo={userInfo}
                chats={chats}
                setSearching={setSearching}
              />
              <button
                className="bg-white rounded-full p-1 ml-auto"
                onClick={handleCloseSearch}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default Finding;
