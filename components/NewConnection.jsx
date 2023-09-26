"use client";

import { pusherClient } from "@/lib/pusher";
import {
  presenceChannelBinder,
  presenceChannelUnBinder,
} from "@/utils/ConnectionPusher/utils";
import { toPusherKey } from "@/utils/toPusherKey";
import { Power0 } from "gsap";
import { gsap } from "gsap";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const NewConnection = ({ userInfo, chats, setSearching }) => {
  const [pool, setPool] = useState([]);
  const [totalOnline, setTotalOnline] = useState(0);
  const [search, setSearch] = useState(false);
  const [heading, setHeading] = useState("Searching");

  const circleHeight = 8;
  const [body, setBody] = useState(
    <div className="flex h-12 w-12 relative">
      <span
        id="square-0"
        className="bg-black absolute rounded-full"
        style={{ height: circleHeight, width: circleHeight }}
      />
      <span
        id="square-1"
        className="bg-black absolute rounded-full"
        style={{ height: circleHeight, width: circleHeight }}
      />
      <span
        id="square-2"
        className="bg-black absolute rounded-full"
        style={{ height: circleHeight, width: circleHeight }}
      />
      <span
        id="square-3"
        className="bg-black absolute rounded-full"
        style={{ height: circleHeight, width: circleHeight }}
      />
      <span
        id="square-4"
        className="bg-black absolute rounded-full"
        style={{ height: circleHeight, width: circleHeight }}
      />
      <span
        id="square-5"
        className="bg-black absolute rounded-full"
        style={{ height: circleHeight, width: circleHeight }}
      />
      <span
        id="square-6"
        className="bg-black absolute rounded-full"
        style={{ height: circleHeight, width: circleHeight }}
      />
      <span
        id="square-7"
        className="bg-black absolute rounded-full"
        style={{ height: circleHeight, width: circleHeight }}
      />
    </div>
  );
  console.log(new Array(8));

  const filteredChats = chats.map(
    (chat) =>
      chat.chat.users.filter((user) => user.userId !== userInfo.id)[0].userId
  );

  const poolFilter = (member) =>
    member.id !== userInfo.id && !filteredChats.includes(member.id);

  const fns = {
    connectionSucceed: function connectionSucceed(members) {
      // Set total online
      setTotalOnline(Object.keys(members.members).length);
      // Pool of all valid members
      setPool(Object.values(members.members).filter(poolFilter));
      // Set searching true
      setSearch(true);
    },

    addMember: function addMember(member) {
      // Add member
      setTotalOnline((prev) => prev + 1);
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

  const handleSearch = async () => {
    const maxLength = pool.length;
    const randomNumber = Math.floor(Math.random() * (maxLength - 1));
    const user = pool[randomNumber];
    // Make sure to verify user does not exceed limit before connecting
    // if exceeds redo search
    const getUser = async () => {
      const res = await fetch(`/api/user/${user.id}`);
      const data = await res.json();
      let restricted = chats.map((chat) =>
        chat.chat.users.filter((user) => user !== userInfo.id)
      );
      restricted = [...new Set(...restricted).values()];
      if (!restricted.includes(user.id)) {
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
            console.log("CREATING CHAT");
            const matchRes = await fetch("/api/match", {
              method: "POST",
              body: JSON.stringify({
                users: [data, userInfo],
              }),
            });
            const createChat = setTimeout(async () => {
              const res = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({
                  users: [data, userInfo],
                }),
              });
              const chat = await res.json();
              // setChats((prev) => [...prev, chat]);
              setPool((prev) => prev.filter((user) => user.id !== data.id));
              return () => {
                clearTimeout(createChat);
              };
            }, 1000);
            break;
        }
      }
    };
    if (user) getUser();
  };

  useEffect(() => {
    const deleteRequestHandler = (data) => {
      const user = data.users.filter((user) => user.user.id !== userInfo.id)[0]
        .user;
      console.log(`USER ${user.username} ADDED TO ACTIVE SEARCH`);
      setPool((prev) => [...prev, user]);
    };
    const updateRequestHandler = (data) => {
      setSearching(false);
      document.getElementById("search-connection").close();
      console.log(`USER ${null} REMOVED FROM ACTIVE SEARCH`);
      setPool((prev) => prev.filter((user) => !data.users.includes(user.id)));
      setSearch(false);
    };
    const matchRequestHandler = (data) => {
      setHeading("We found a match!");
      setBody(
        <div
          key="match-found"
          className="flex flex-col justify-center items-center gap-y-4"
        >
          <span>
            <Image src="/user.png" height={50} width={50} />
          </span>
          <span className="bg-blue-100 font-bold py-2 px-8 rounded-md">
            {userInfo.id !== data[0].id ? data[1].username : data[0].username}
          </span>
        </div>
      );
    };
    pusherClient.subscribe(toPusherKey(`user:${userInfo.id}:delete-chat`));
    pusherClient.subscribe(toPusherKey(`user:${userInfo.id}:add-chat`));
    pusherClient.subscribe(toPusherKey(`user:${userInfo.id}:match_request`));
    pusherClient.bind("delete-chat", deleteRequestHandler);
    pusherClient.bind("add-chat", updateRequestHandler);
    pusherClient.bind("match_request", matchRequestHandler);
    presenceChannelBinder(userInfo, fns);
    return () => {
      presenceChannelUnBinder(fns);
      pusherClient.unsubscribe(toPusherKey(`user:${userInfo.id}:delete-chat`));
      pusherClient.unsubscribe(toPusherKey(`user:${userInfo.id}:add-chat`));
      pusherClient.unsubscribe(
        toPusherKey(`user:${userInfo.id}:match_request`)
      );
      pusherClient.unbind("delete-chat", deleteRequestHandler);
      pusherClient.unbind("add-chat", updateRequestHandler);
      pusherClient.unbind("match_request", matchRequestHandler);
    };
  }, []);

  useEffect(() => {
    if (search) handleSearch();
  }, [search]);

  useEffect(() => {
    let init, secondStage, finalStage, close;

    const initPos = [
      [0, 0],
      [16, -8],
      [32, 0],
      [40, 16],
      [32, 32],
      [16, 40],
      [0, 32],
      [-8, 16],
    ];

    const direction = [
      [16, -8],
      [32, 0],
      [40, 16],
      [32, 32],
      [16, 40],
      [0, 32],
      [-8, 16],
      [0, 0],
    ];

    let tl;
    for (let x = 0; x < 8; x++) {
      tl = gsap.fromTo(
        `#square-${x}`,
        {
          x: initPos[x % 8][0],
          y: initPos[x % 8][1],
          height: circleHeight,
          width: circleHeight,
        },
        {
          x: direction[x % 8][0],
          y: direction[x % 8][1],
          height: circleHeight,
          width: circleHeight,
          duration: 0.5,
          ease: Power0.easeNone,
          repeat: -1,
        }
      );
    }

    init = setTimeout(() => {
      setHeading("Searching more");
      secondStage = setTimeout(() => {
        setHeading("Searching most");
        finalStage = setTimeout(() => {
          setHeading(
            "Sorry, we couldn't find a match for you. Try again in a few minutes."
          );
          setBody("");
          close = setTimeout(() => {
            document.getElementById("search-connection").close();
            setSearching(false);
          }, 2000);
        }, 5000);
      }, 5000);
    }, 10000);

    return () => {
      tl.kill();
      clearTimeout(init);
      clearTimeout(secondStage);
      clearTimeout(finalStage);
      clearTimeout(close);
    };
  }, [search]);

  const handleCloseSearch = (e) => {
    setSearching(false);
    document.getElementById("search-connection").close();
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-y-4 px-8">
        <span className="pb-4">{heading}</span>
        {body}
      </div>
      {body && (
        <button
          className="bg-black rounded-md p-1 mt-auto ml-auto text-white px-4 text-base font-bold"
          onClick={handleCloseSearch}
        >
          Cancel
        </button>
      )}
    </>
  );
};

export default NewConnection;
