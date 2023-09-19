"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const MyChats = () => {
  const session = useSession();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function getChats() {
      const res = await fetch("/api/chats");
      const data = await res.json();
      setChats(data.chats);
    }
    getChats();
  }, []);

  return (
    session.status === "authenticated" && (
      <div className="flex flex-col bg-red-200 px-4 py-4 gap-y-4 text-xl">
        {chats.map((chat) => (
          <Link
            key={chat.chatId}
            href={`/chat/${chat.chatId}`}
            className="bg-white px-4 py-2"
          >
            {chat.chat.name ??
              chat.chat.users
                .map((user) => user.user.username)
                .join(" & ")
                .concat("'s Room")}
          </Link>
        ))}
      </div>
    )
  );
};

export default MyChats;
