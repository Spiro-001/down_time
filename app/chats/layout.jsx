import MyChats from "@/components/MyChats";
import Nav from "@/components/Nav";
import UserProvider from "@/components/UserProvider";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="flex w-full h-screen">
      <UserProvider>
        <MyChats />
      </UserProvider>
      <div className="flex flex-col flex-1">
        <Nav />
        {children}
      </div>
    </div>
  );
};

export default layout;
