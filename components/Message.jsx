import React from "react";

const Message = ({ message, myId, samePerson, idx }) => {
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
        <div className="flex items-center justify-between w-full">
          <p
            id={`${
              message.author.id === myId
                ? "message-block-left"
                : "message-block-right"
            }`}
            style={{
              transform:
                message.author.id === myId
                  ? "translate(-500px, 0)"
                  : "translate(500px, 0)",
            }}
            className={`${
              message.author.id !== myId
                ? "bg-red-100 rounded-bl-md"
                : "bg-blue-200 rounded-br-md"
            } px-3 py-1 rounded-tl-md rounded-tr-md max-w-[400px] break-words shadow-sm`}
          >
            {message.message}
          </p>
          <span
            className="text-xs w-0 pr-0 relative whitespace-nowrap"
            id="m-time"
            style={{
              left: 30,
            }}
          >
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
