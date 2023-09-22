"use client";

import { pusherClient } from "@/lib/pusher";
import {
  presenceChannelBinder,
  presenceChannelUnBinder,
} from "@/utils/ConnectionPusher/utils";
import { toPusherKey } from "@/utils/toPusherKey";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const NewConnection = ({ userInfo, chats, setChats }) => {
  const router = useRouter();
  const [pool, setPool] = useState([]);
  const [totalOnline, setTotalOnline] = useState(0);

  const filteredChats = chats.map((chat) => {
    console.log(chats);
    return chat.chat.users.filter((user) => user.userId !== userInfo.id)[0]
      .userId;
  });

  const poolFilter = (member) => {
    return member.id !== userInfo.id && !filteredChats.includes(member.id);
  };

  const fns = {
    connectionSucceed: function connectionSucceed(members) {
      // Set total online
      setTotalOnline(Object.keys(members.members).length);
      // Pool of all valid members
      setPool(Object.values(members.members).filter(poolFilter));
    },

    addMember: function addMember(member) {
      // Add member
      setTotalOnline((prev) => prev + 1);
      console.log(member, filteredChats);
      if (!filteredChats.includes(member.info.id)) {
        setPool((prev) => [...prev, member.info]);
      }
    },

    removeMember: function removeMember(member) {
      // Remove member
      setPool((prev) => {
        console.log(prev, member);
        return prev.filter((user) => user.id !== member.info.id);
      });
      setTotalOnline((prev) => prev - 1);
    },

    connectionError: function connectionError(error) {},
  };

  const handleClick = () => {
    const maxLength = pool.length;
    const randomNumber = Math.floor(Math.random() * (maxLength - 1));
    const user = pool[randomNumber];
    // Make sure to verify user does not exceed limit before connecting
    // if exceeds redo search
    const getUser = async () => {
      const res = await fetch(`/api/user/${user.id}`);
      const data = await res.json();
      console.log(data);
      switch (data.membership) {
        case "basic":
          if (data.chats.length > 3) {
            break;
          }

        case "premium":
          if (data.chats.length > 10) {
            break;
          }
        default:
          const res = await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({
              users: [data, userInfo],
            }),
          });
          const chat = await res.json();
          // setChats((prev) => [...prev, chat]);
          setPool((prev) => prev.filter((user) => user.id !== data.id));
          router.push(`/chats/${chat.chatId}`);
          break;
      }
    };
    if (user) getUser();
  };

  useEffect(() => {
    const deleteRequestHandler = (data) => {
      console.log(pool, data);
      const user = data.users.filter((user) => user.user.id !== userInfo.id)[0]
        .user;
      setPool((prev) => [...prev, user]);
    };
    const updateRequestHandler = (data) => {
      setPool((prev) => prev.filter((user) => !data.users.includes(user.id)));
    };
    pusherClient.subscribe(toPusherKey(`user:${userInfo.id}:delete-chat`));
    pusherClient.subscribe(toPusherKey(`user:${userInfo.id}:add-chat`));
    pusherClient.bind("delete-chat", deleteRequestHandler);
    pusherClient.bind("add-chat", updateRequestHandler);
    presenceChannelBinder(userInfo, fns);
    return () => {
      presenceChannelUnBinder(fns);
      pusherClient.unsubscribe(toPusherKey(`user:${userInfo.id}:delete-chat`));
      pusherClient.unsubscribe(toPusherKey(`user:${userInfo.id}:add-chat`));
      pusherClient.unbind("delete-chat", deleteRequestHandler);
      pusherClient.unbind("add-chat", updateRequestHandler);
    };
  }, []);

  return (
    <div>
      online
      {totalOnline}
      available
      {pool.length}
      <button onClick={handleClick}>New Conversation</button>
    </div>
  );
};

export default NewConnection;
