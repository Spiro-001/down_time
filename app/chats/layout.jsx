import MyChats from "@/components/MyChats";
import Nav from "@/components/Nav";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="flex w-full h-screen">
      <MyChats />
      <div className="flex flex-col flex-1">
        <Nav />
        {children}
      </div>
    </div>
  );
};

export default layout;
