import React from "react";

const Message = ({ message, myId, samePerson }) => {
  return (
    <div
      className={`${
        message.author.id !== myId ? "items-end" : ""
      } flex flex-col w-full gap-y-1`}
    >
      <div className="flex items-center justify-between">
        {/* <div
          className={`${
            message.author.id !== myId ? "items-end" : ""
          } flex flex-col w-full`}
        > */}
        {/* {!samePerson && (
            <span className="text-sm px-1 rounded-md w-fit">
              {message.author.username}
            </span>
          )} */}
        <div className="flex items-center w-full justify-between">
          <span
            className={`${
              message.author.id !== myId ? "bg-red-100" : "bg-blue-200"
            } w-fit px-3 py-1 mr-4 rounded-md flex items-center`}
          >
            {message.message}
          </span>
          <span className="text-xs w-0 pr-0 whitespace-nowrap" id="m-time">
            {new Date(message.createdAt).toLocaleTimeString("us-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Message;
