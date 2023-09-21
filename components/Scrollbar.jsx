"use client";

import { gsap } from "gsap";
import React, { useEffect, useState } from "react";

const Scrollbar = ({ totalMessage }) => {
  const [scrollBar, setScrollBar] = useState({
    offsetHeight: 0,
    scrollHeight: 0,
  });

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    const { offsetHeight, scrollHeight } = chatContainer;

    setScrollBar({
      offsetHeight: offsetHeight,
      scrollHeight: scrollHeight,
    });
    gsap.to("#thumb", {
      height: (offsetHeight / scrollHeight) * 100 + "%",
    });
    gsap.to("#thumb", {
      opacity: 0,
      delay: 1,
    });
  }, [totalMessage]);

  useEffect(() => {
    let timer = null;
    const chatContainer = document.getElementById("chat-container");
    const moveScroll = () => {
      const { offsetHeight, scrollHeight, scrollTop } = chatContainer;
      const tl = gsap.timeline();
      gsap.to("#thumb", {
        opacity: 1,
        duration: 0.2,
      });
      tl.to("#thumb", {
        top: (scrollTop / scrollHeight) * 100 + "%",
        duration: 0,
      });
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        // do something
        tl.to("#thumb", {
          opacity: 0,
          duration: 0.2,
        });
      }, 1500);
      return () => {
        tl.kill();
      };
    };
    chatContainer.addEventListener("scroll", moveScroll);
    return () => {
      chatContainer.removeEventListener("scroll", moveScroll);
    };
  }, []);

  return (
    <div
      className="absolute right-4 flex justify-center py-2"
      style={{ height: scrollBar.offsetHeight, width: 10 }}
    >
      <div className="w-full relative flex justify-center">
        <span
          id="thumb"
          className="bg-gray-500 rounded-full absolute"
          style={{
            height: 0,
            width: 6,
          }}
        />
      </div>
    </div>
  );
};

export default Scrollbar;
