"use client";

import React, { useEffect, useRef, useState } from "react";

const SendMessage = ({ chatId, setChatRoom }) => {
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
        inputRef.current.value = "";
        const response = await fetch("/api/message", {
          method: "POST",
          body: JSON.stringify({
            userId: "1",
            message,
            chatId,
          }),
        });
        const newMessage = await response.json();
        setChatRoom((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage],
        }));
      }
    };
    document.addEventListener("input", resizeInput);
    document.addEventListener("keydown", onEnterKey);
    return () => {
      document.removeEventListener("input", resizeInput);
      document.removeEventListener("keydown", onEnterKey);
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const message = data.get("message");
    inputRef.current.value = "";
    const response = await fetch("/api/message", {
      method: "POST",
      body: JSON.stringify({
        userId: "1",
        message,
        chatId,
      }),
    });
    const newMessage = await response.json();
    setChatRoom((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
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
