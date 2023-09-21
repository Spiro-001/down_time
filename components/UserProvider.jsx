import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React, { cloneElement } from "react";

const UserProvider = async ({ children }) => {
  const session = await getServerSession(authOptions);
  const res = await fetch(`http://localhost:3000/api/user/${session.id}`);
  const data = await res.json();
  const childrenCopy = cloneElement(children, { data });
  return childrenCopy;
};

export default UserProvider;
