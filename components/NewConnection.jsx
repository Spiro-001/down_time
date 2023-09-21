"use client";

import {
  presenceChannelBinder,
  presenceChannelUnBinder,
} from "@/utils/ConnectionPusher/utils";
import React, { useEffect, useState } from "react";

const NewConnection = ({ userInfo, chats, setChats }) => {
  const [pool, setPool] = useState([]);
  const [totalOnline, setTotalOnline] = useState(0);

  const filteredChats = chats.map((chat) => {
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
      if (!filteredChats.includes(member.info.id)) {
        setPool((prev) => [...prev, member]);
      }
    },

    removeMember: function removeMember(member) {
      // Remove member
      setPool((prev) => prev.filter((user) => user.id !== member.info.id));
      setTotalOnline((prev) => prev - 1);
    },

    connectionError: function connectionError(error) {
      console.log(error);
    },
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
          console.log(chat);
          setChats((prev) => [...prev, chat]);
          break;
      }
    };
    getUser();
  };

  useEffect(() => {
    presenceChannelBinder(userInfo, fns);
    return () => {
      presenceChannelUnBinder(fns);
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
