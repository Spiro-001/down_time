"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MyChats = () => {
  const session = useSession();
  const router = useRouter();

  const contextMenuRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [contextMenu, setContextMenu] = useState({
    open: false,
    type: null,
    chatId: null,
    location: {
      x: 0,
      y: 0,
    },
  });

  useEffect(() => {
    async function getChats() {
      const res = await fetch("/api/chats");
      const data = await res.json();
      setChats(data.chats);
    }
    const handleClick = (e) => {
      if (contextMenuRef !== e.target) {
        setContextMenu((prev) => ({ ...prev, open: false }));
      }
    };
    document.addEventListener("click", handleClick);
    getChats();
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const openContextMenu = (e, chatId) => {
    e.preventDefault();
    setContextMenu((prev) => ({ ...prev, open: true, chatId }));
  };

  const moveOutside = (e) => {
    const element = e.target;
    const handleClick = async (e) => {
      if (element !== e.target) {
        const name = element.innerText;
        await handleEditSubmit(name);
        setContextMenu((prev) => ({ ...prev, type: null }));
      }
      document.removeEventListener("click", handleClick);
    };
    document.addEventListener("click", handleClick);
  };

  const handleEdit = async (e) => {
    setContextMenu((prev) => ({ ...prev, type: "edit" }));
  };

  const handleSubmit = async (e) => {
    if (e.keyCode === 13) {
      await handleEditSubmit(e.target.innerHTML);
      setContextMenu((prev) => ({ ...prev, type: null }));
    }
  };

  const handleEditSubmit = async (name) => {
    const res = await fetch("/api/chat", {
      method: "PATCH",
      body: JSON.stringify({
        id: contextMenu.chatId,
        name,
      }),
    });
  };

  const handleDelete = async () => {
    console.log(chats);
    setChats((prev) => prev.filter((chat) => chat.id !== contextMenu.chatId));
    const res = await fetch(`/api/chat/${contextMenu.chatId}`, {
      method: "DELETE",
    });
    router.push("/chats");
  };

  return (
    <div className="flex flex-col bg-red-200 px-4 py-4 gap-y-4 text-xl">
      <div>new connection</div>
      {chats.map((chat) => (
        <Link
          href={`/chats/${chat.chatId}`}
          key={chat.chatId}
          contentEditable={
            contextMenu.type === "edit" && contextMenu.chatId === chat.chatId
              ? true
              : false
          }
          onMouseLeave={
            contextMenu.type === "edit" && contextMenu.chatId === chat.chatId
              ? moveOutside
              : undefined
          }
          className="w-full flex bg-white px-4 py-2"
          onContextMenu={(e) => openContextMenu(e, chat.chatId)}
          onKeyDown={handleSubmit}
        >
          {chat.chat.name ??
            chat.chat.users
              .map((user) => user.user.username)
              .join(" & ")
              .concat("'s Room")}
        </Link>
      ))}
      {contextMenu.open && (
        <div
          id="context-menu"
          className="flex flex-col items-start"
          ref={contextMenuRef}
        >
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default MyChats;
