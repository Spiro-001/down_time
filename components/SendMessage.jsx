"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef, useState } from "react";

const SendMessage = ({ chatId, myId, active }) => {
  const inputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const resizeInput = () => {
      inputRef.current.style.height = "0px";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    };
    const onEnterKey = async (e) => {
      if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        const data = new FormData(formRef.current);
        const message = data.get("message");
        if (message.length > 0) {
          inputRef.current.value = "";
          inputRef.current.style.height = "0px";
          inputRef.current.style.height = inputRef.current.scrollHeight + "px";
          const response = await fetch("/api/message", {
            method: "POST",
            body: JSON.stringify({
              userId: myId,
              message,
              chatId,
              active,
            }),
          });
          await fetch(`/api/typing/${chatId}`, {
            method: "POST",
            body: JSON.stringify({
              userId: myId,
              typing: false,
            }),
          });
        }
      }
    };
    document.addEventListener("input", resizeInput);
    document.addEventListener("keydown", onEnterKey);
    return () => {
      document.removeEventListener("input", resizeInput);
      document.removeEventListener("keydown", onEnterKey);
    };
  }, [myId, active]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const message = data.get("message");
    inputRef.current.value = "";
    inputRef.current.style.height = "0px";
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    const response = await fetch("/api/message", {
      method: "POST",
      body: JSON.stringify({
        userId: myId,
        message,
        chatId,
        active,
      }),
    });
    await fetch(`/api/typing/${chatId}`, {
      method: "POST",
      body: JSON.stringify({
        userId: myId,
        typing: false,
      }),
    });
  };

  const handleInput = (e) => {
    if (e.target.value.length === 1) {
      fetch(`/api/typing/${chatId}`, {
        method: "POST",
        body: JSON.stringify({
          userId: myId,
          typing: true,
        }),
      });
    } else if (e.target.value.length <= 0) {
      fetch(`/api/typing/${chatId}`, {
        method: "POST",
        body: JSON.stringify({
          userId: myId,
          typing: false,
        }),
      });
    }
  };

  return (
    <form
      ref={formRef}
      className="w-full flex relative rounded-md border-black border bg-white shadow-md"
      onSubmit={onSubmit}
    >
      <textarea
        ref={inputRef}
        className="flex-1 py-2 pl-6 pr-24 rounded-md break-words resize-none overflow-hidden outline-0 h-fit"
        type="submit"
        name="message"
        style={{ height: 40 }}
        onChange={handleInput}
      />
      <button
        type="submit"
        className="absolute right-2 bottom-1 bg-blue-600 px-4 py-1 rounded-md text-white font-bold"
      >
        Send
      </button>
    </form>
  );
};

export default SendMessage;
