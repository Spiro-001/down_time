"use client";

import Link from "next/link";
import Finding from "./Finding";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";

const MyChats = ({ data }) => {
  const router = useRouter();
  const pathName = usePathname();
  const contextMenuRef = useRef(null);
  const [userInfo, setUserInfo] = useState({
    id: data.id,
    username: data.username,
    membership: data.membership,
    email: data.email,
  });
  const [chats, setChats] = useState(data.chats);
  const [updated, setUpdate] = useState(false);
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
    console.log("RELOADING INIT MYCHAT", userInfo);
    const handleClick = (e) => {
      if (contextMenuRef !== e.target) {
        setContextMenu((prev) => ({ ...prev, open: false }));
      }
    };
    const updateRequestHandler = (data) => {
      console.log("ADD CHAT");
      console.log(chats, data);
      setChats((prev) => [...prev, { chat: data }]);
      router.push(`/chats/${data.id}`);
    };
    const updateChatRequestHandler = (data) => {
      console.log("DELETE CHAT");
      console.log(userInfo);
      setChats((prev) =>
        prev.filter((chat) => chat.chat.id !== data.deletedChat.id)
      );
      router.push("/chats");
    };

    const updateChatNameRequestHandler = (data) => {
      console.log("PATCH CHAT NAME");
      setChats((prev) => {
        prev.map((chat) => {
          if (chat.chat.id === data.id) chat.chat.name = data.name;
          return chat;
        });
        return prev;
      });
      setUpdate(true);
    };

    const messageNotificationHandler = (data) => {
      console.log("NEW MESSAGE");
      if (pathName === "/chats") {
        setChats((prev) => {
          prev.map((chat) => {
            if (chat.chatId === data.chatId)
              chat.notifications = (chat.notifications ?? 0) + 1;
          });
          return prev;
        });
        setUpdate(true);
      }
    };

    const clearMessageNotificationHandler = (data) => {
      setChats((prev) => {
        prev.map((chat) => {
          console.log(chat);
          if (chat.chatId === data.chatId) chat.notifications = 0;
        });
        return prev;
      });
      setUpdate(true);
    };

    setUpdate(false);
    pusherClient.subscribe(toPusherKey(`user:${userInfo.id}:add-chat`));
    pusherClient.subscribe(toPusherKey(`user:${userInfo.id}:update-chat`));
    pusherClient.subscribe(toPusherKey(`user:${userInfo.id}:update_chat`));
    pusherClient.subscribe(
      toPusherKey(`user:${userInfo.id}:add_message_notification`)
    );
    pusherClient.subscribe(
      toPusherKey(`user:${userInfo.id}:clear_message_notification`)
    );
    pusherClient.bind("add-chat", updateRequestHandler);
    pusherClient.bind("update-chat", updateChatRequestHandler);
    pusherClient.bind("update_chat", updateChatNameRequestHandler);
    pusherClient.bind("add_message_notification", messageNotificationHandler);
    pusherClient.bind(
      "clear_message_notification",
      clearMessageNotificationHandler
    );
    document.addEventListener("click", handleClick);
    // getChats();
    return () => {
      console.log("RELOADING MYCHATS");
      document.removeEventListener("click", handleClick);
      pusherClient.unsubscribe(toPusherKey(`user:${userInfo.id}:add-chat`));
      pusherClient.unsubscribe(toPusherKey(`user:${userInfo.id}:update-chat`));
      pusherClient.unsubscribe(toPusherKey(`user:${userInfo.id}:update_chat`));
      pusherClient.unsubscribe(
        toPusherKey(`user:${userInfo.id}:add_message_notification`)
      );
      pusherClient.unsubscribe(
        toPusherKey(`user:${userInfo.id}:clear_message_notification`)
      );
      pusherClient.unbind("add-chat", updateRequestHandler);
      pusherClient.unbind("update-chat", updateChatRequestHandler);
      pusherClient.unbind("update_chat", updateChatNameRequestHandler);
      pusherClient.unbind(
        "add_message_notification",
        messageNotificationHandler
      );
      pusherClient.unbind(
        "clear_message_notification",
        clearMessageNotificationHandler
      );
    };
  }, [chats, updated]);

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
    console.log("CLIENT DELETING");
    const res = await fetch(`/api/chat/${contextMenu.chatId}`, {
      method: "DELETE",
    });
    setChats((prev) =>
      prev.filter((chat) => chat.chat.id !== contextMenu.chatId)
    );
  };

  return (
    <div className="flex flex-col bg-red-200 px-4 py-4 gap-y-4 text-xl">
      <Finding userInfo={userInfo} chats={chats} />
      {chats.map((chat) => (
        <Link
          href={`/chats/${chat.chatId}`}
          key={chat.chat.id}
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
          className="w-full flex bg-white px-4 py-2 rounded-md items-center"
          onContextMenu={(e) => openContextMenu(e, chat.chat.id)}
          onKeyDown={handleSubmit}
        >
          {chat.chat.name}
          {chat.notifications > 0 && (
            <span className="ml-auto bg-red-200 px-2 text-sm h-full flex items-center font-bold rounded-md">
              {chat.notifications > 99 ? "99+" : chat.notifications}
            </span>
          )}
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
