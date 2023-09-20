"use client";

import { Bounce, gsap } from "gsap";
import React, { useEffect } from "react";

const BlankMessage = ({ myId, typingId }) => {
  useEffect(() => {
    gsap.fromTo(
      "#typing-block",
      {
        opacity: 0,
        x: myId === typingId ? -5 : 5,
        y: 10,
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.5,
      }
    );
    const tl = gsap.timeline({
      repeat: -2,
    });
    tl.fromTo(
      "#dot",
      {
        y: 0,
      },
      {
        y: -6,
        duration: 0.2,
        stagger: {
          repeat: 1,
          amount: 0.2,
          yoyo: true,
        },
      }
    );
    tl.to("#dot", {
      y: 0,
      duration: 0.5,
      stagger: {
        repeat: 1,
        amount: 0.2,
        yoyo: true,
      },
    });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      id="typing-block"
      className={`${
        myId === typingId ? "bg-blue-200" : "bg-red-50 ml-auto"
      } px-3 py-1 mr-4 rounded-md break-words relative flex items-center justify-between w-fit`}
    >
      <span id="dot">•</span>
      <span id="dot">•</span>
      <span id="dot">•</span>
    </div>
  );
};

export default BlankMessage;
