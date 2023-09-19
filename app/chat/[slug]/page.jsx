"use client";

import Message from "@/components/Message";
import Scrollbar from "@/components/Scrollbar";
import SendMessage from "@/components/SendMessage";
import { loginIsRequiredClient } from "@/lib/auth";
import { gsap } from "gsap";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

// data = {
//   id: 1,
//   messages: [
//     {
//       author: {
//         id: 1,
//         email: "test@test.com",
//         username: "test",
//       },
//       chatId: 1,
//       message: "test",
//       userId: 1,
//     },
//   ],
//   users: [
//     {
//       user: {
//         id: 1,
//         email: "test@test.com",
//         username: "test",
//       },
//     },
//   ],
// };

const ChatRoom = ({ params }) => {
  loginIsRequiredClient();
  const session = useSession();
  const myId = session.data?.id;

  const chatRef = useRef(null);

  const [extra, setExtra] = useState({
    timeVisible: false,
  });

  const [chatRoom, setChatRoom] = useState({
    id: params.slug,
    users: [],
    messages: [],
    name: "",
  });

  useEffect(() => {
    const getMessages = async () => {
      const res = await fetch(`/api/messages/${params.slug}`);
      const data = await res.json();
      setChatRoom(data);
    };

    getMessages();
  }, []);

  useEffect(() => {
    const showTime = (e) => {
      if (e.code === "KeyT" && e.shiftKey) {
        console.log(extra.timeVisible);
        if (!extra.timeVisible) {
          gsap.to("#m-time", {
            paddingRight: 64,
          });
          setExtra((prev) => ({ ...prev, timeVisible: true }));
        } else {
          gsap.to("#m-time", {
            paddingRight: 0,
          });
          setExtra((prev) => ({ ...prev, timeVisible: false }));
        }
      }
    };
    document.addEventListener("keypress", showTime);
    return () => {
      document.removeEventListener("keypress", showTime);
    };
  }, [extra.timeVisible]);

  return (
    <div className="flex h-screen flex-1 px-8 py-4">
      <div className="flex-1 flex flex-col px-2 py-4">
        <span className="text-4xl font-bold pb-4 px-4 border-b border-black">
          {chatRoom.name ??
            chatRoom.users
              .map((user) => user.user.username)
              .join(" & ")
              .concat("'s Room")}
        </span>
        <div className="h-full px-3 py-4 flex mx-4 my-4 flex-col gap-y-4 relative bg-slate-200 rounded-md">
          <div className="flex">
            <div
              id="chat-container"
              ref={chatRef}
              style={{ height: 780 }}
              className="flex-1 grid grid-flow-row pl-6 pt-3 pb-3 h-full relative gap-y-1 bg-gray-50 rounded-md border border-gray-100 shadow-sm overflow-x-hidden overflow-y-auto"
            >
              {chatRoom.messages.map((message, idx) => {
                if (
                  idx !== 0 &&
                  chatRoom.messages[idx].author.id ===
                    chatRoom.messages[idx - 1].author.id
                ) {
                  return (
                    <Message
                      key={message.id}
                      message={message}
                      myId={myId}
                      samePerson={true}
                    />
                  );
                } else {
                  return (
                    <Message
                      key={message.id}
                      message={message}
                      myId={myId}
                      samePerson={false}
                    />
                  );
                }
              })}
            </div>
            {chatRoom.messages.length > 0 && <Scrollbar />}
          </div>
          <div className="min-w-full relative" style={{ height: 42 }}>
            <div className="ml-auto mt-auto max-w-[600px] absolute bottom-0 right-0 w-full">
              <SendMessage chatId={params.slug} setChatRoom={setChatRoom} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
