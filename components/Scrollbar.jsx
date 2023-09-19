"use client";

import { gsap } from "gsap";
import React, { useEffect, useState } from "react";

const Scrollbar = () => {
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
      height: ((offsetHeight - 16) / scrollHeight) * 100 + "%",
    });
    gsap.to("#thumb", {
      opacity: 0,
      delay: 1,
    });
  }, []);

  useEffect(() => {
    let timer = null;
    const moveScroll = () => {
      const { offsetHeight, scrollHeight, scrollTop } =
        document.getElementById("chat-container");
      const tl = gsap.timeline();
      gsap.to("#thumb", {
        opacity: 1,
        duration: 0.2,
      });
      tl.to("#thumb", {
        top: ((scrollTop + 5) / scrollHeight) * 100 + "%",
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
      }, 500);
    };
    document
      .getElementById("chat-container")
      .addEventListener("scroll", moveScroll);
    return () => {
      document
        .getElementById("chat-container")
        .removeEventListener("scroll", moveScroll);
    };
  }, []);

  return (
    <div
      className="absolute right-4 flex justify-center py-2"
      style={{ height: scrollBar.offsetHeight, width: 10 }}
    >
      <span
        id="thumb"
        className="bg-gray-400 rounded-full absolute"
        style={{
          height: 0,
          width: 6,
        }}
      />
    </div>
  );
};

export default Scrollbar;
