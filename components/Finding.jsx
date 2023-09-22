import React from "react";
import NewConnection from "./NewConnection";

const Finding = ({ userInfo, chats, setChats }) => {
  return (
    <div>
      <NewConnection userInfo={userInfo} chats={chats} setChats={setChats} />
    </div>
  );
};

export default Finding;
