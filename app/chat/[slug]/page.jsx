"use client";

import BlankMessage from "@/components/BlankMessage";
import Message from "@/components/Message";
import Scrollbar from "@/components/Scrollbar";
import SendMessage from "@/components/SendMessage";
import { loginIsRequiredClient } from "@/lib/auth";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/utils/toPusherKey";
import { Power2, gsap } from "gsap";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
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
    isTyping: false,
  });

  const [chatRoom, setChatRoom] = useState({
    id: params.slug,
    users: [],
    messages: [],
    name: "Loading...",
  });

  useEffect(() => {
    const getMessages = async () => {
      const res = await fetch(`/api/messages/${params.slug}`);
      const data = await res.json();
      setChatRoom(data);
    };
    pusherClient.subscribe(toPusherKey(`user:${params.slug}:incoming_message`));
    pusherClient.subscribe(toPusherKey(`user:${params.slug}:typing_message`));
    const messageRequestHandler = (data) => {
      setChatRoom((prev) => ({
        ...prev,
        messages: [...prev.messages, data],
      }));
    };
    const typingRequestHandler = (data) => {
      gsap.registerPlugin(ScrollToPlugin);
      const chatContainer = document.getElementById("chat-container");
      console.log(data.typing);
      if (data.typing) {
        gsap.to("#chat-container", {
          scrollTo: { x: 0, y: chatContainer.scrollHeight },
          duration: 0.2,
          ease: Power2.easeOut,
        });
      }
      setExtra((prev) => ({ ...prev, isTyping: data }));
    };
    pusherClient.bind("incoming_message", messageRequestHandler);
    pusherClient.bind("typing_message", typingRequestHandler);
    getMessages();

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${params.slug}:incoming_message`)
      );
      pusherClient.unsubscribe(
        toPusherKey(`user:${params.slug}:typing_message`)
      );
      pusherClient.unbind("incoming_message", messageRequestHandler);
      pusherClient.unbind("typing_message", messageRequestHandler);
    };
  }, []);

  useEffect(() => {
    const showTime = (e) => {
      if (e.code === "KeyT" && e.shiftKey) {
        console.log(extra.timeVisible);
        if (!extra.timeVisible) {
          gsap.to("#m-time", {
            paddingRight: 78,
            duration: 0.3,
          });
          setExtra((prev) => ({ ...prev, timeVisible: true }));
        } else {
          gsap.to("#m-time", {
            paddingRight: 0,
            duration: 0.3,
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

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);
    const chatContainer = document.getElementById("chat-container");
    // gsap.to("#chat-container", {
    //   scrollTo: { x: 0, y: chatContainer.scrollHeight },
    //   duration: 1.5,
    //   ease: Power2.easeOut,
    // });
    gsap.to("#message-block-left", {
      x: 0,
      stagger: {
        amount: 0,
      },
      duration: 0.5,
    });
    gsap.to("#message-block-right", {
      x: 0,
      stagger: {
        amount: 0.5,
      },
      duration: 0.5,
    });
  }, [chatRoom.messages]);

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
              className="flex-1 flex flex-col pl-6 pr-6 pt-3 pb-3 h-full relative gap-y-1 bg-gray-50 rounded-md border border-gray-100 shadow-sm overflow-x-hidden overflow-y-auto"
            >
              {chatRoom.messages.map((message, idx) => {
                if (
                  idx !== 0 &&
                  chatRoom.messages[idx].author.id ===
                    chatRoom.messages[idx - 1].author.id
                ) {
                  const dateBefore = new Date(
                    chatRoom.messages[idx - 1].createdAt
                  );
                  const date = new Date(message.createdAt);
                  const month = date.getMonth() + 1;
                  const day = date.getDate();
                  const monthBefore = dateBefore.getMonth() + 1;
                  const dayBefore = dateBefore.getDate();
                  return (
                    <>
                      {month * day > monthBefore * dayBefore && (
                        <span className="w-full flex justify-center pb-1 mb-2 border-b-2 border-gray-200 font-bold text-slate-700">
                          {date.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      <Message
                        key={message.id}
                        message={message}
                        myId={myId}
                        samePerson={true}
                        idx={idx}
                      />
                    </>
                  );
                } else if (
                  idx !== 0 &&
                  chatRoom.messages[idx].author.id !==
                    chatRoom.messages[idx - 1].author.id
                ) {
                  const dateBefore = new Date(
                    chatRoom.messages[idx - 1].createdAt
                  );
                  const date = new Date(message.createdAt);
                  const month = date.getMonth() + 1;
                  const day = date.getDate();
                  const monthBefore = dateBefore.getMonth() + 1;
                  const dayBefore = dateBefore.getDate();
                  return (
                    <>
                      {month * day > monthBefore * dayBefore && (
                        <span className="w-full flex justify-center pb-1 mb-2 border-b-2 border-gray-200 font-bold text-slate-700">
                          {date.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      <Message
                        key={message.id}
                        message={message}
                        myId={myId}
                        samePerson={false}
                        idx={idx}
                      />
                    </>
                  );
                } else {
                  return (
                    <>
                      <span className="w-full flex justify-center px-8 pb-1 mb-2 border-b-2 border-gray-200 font-bold text-slate-700">
                        {new Date(message.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <Message
                        key={message.id}
                        message={message}
                        myId={myId}
                        samePerson={false}
                        idx={idx}
                      />
                    </>
                  );
                }
              })}
              {extra.isTyping.typing && (
                <BlankMessage myId={myId} typingId={extra.isTyping.userId} />
              )}
            </div>
            {chatRoom.messages.length > 0 && (
              <Scrollbar
                totalMessage={chatRoom.messages.length + extra.isTyping.typing}
              />
            )}
          </div>
          <div className="min-w-full relative" style={{ height: 42 }}>
            <div className="ml-auto mt-auto max-w-[600px] absolute bottom-0 right-0 w-full">
              <SendMessage
                chatId={params.slug}
                setChatRoom={setChatRoom}
                myId={myId}
                typingId={extra.isTyping.userId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
