import MyChats from "@/components/MyChats";
import Nav from "@/components/Nav";
import { getUserData } from "@/utils/getUserData";
import React from "react";

const layout = async ({ children }) => {
  const data = await getUserData();
  return (
    <div className="flex w-full h-screen">
      <MyChats data={data} />
      <div className="flex flex-col flex-1">
        <Nav />
        {children}
      </div>
    </div>
  );
};

export default layout;
