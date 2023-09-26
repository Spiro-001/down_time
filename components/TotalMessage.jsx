"use client";

import React from "react";

const TotalMessage = ({ messages }) => {
  return (
    <div className="bg-white w-full max-w-[300px] p-4 flex flex-col gap-y-4 justify-between rounded-md shadow-sm">
      <span className="bg-red-100 w-fit rounded-md px-4 py-1 text-lg font-semibold">
        Total Messages
      </span>
      <div className="flex justify-between items-center">
        <span className="bg-purple-200 w-fit px-3 py-1 rounded-md">
          {messages.length}
        </span>
        <span>All Messages</span>
      </div>
    </div>
  );
};

export default TotalMessage;
