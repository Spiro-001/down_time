import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Children, cloneElement } from "react";

const UserProvider = async ({ children }) => {
  const session = await getServerSession(authOptions);
  const res = await fetch(`http://localhost:3000/api/user/${session.id}`);
  const data = await res.json();
  // const childrenCopy = children.map((childElement) => {
  //   if (childElement.props.children) {
  //     childElement.props.children.map((childElement) => {
  //       console.log(chi)
  //       return cloneElement(childElement, { data });
  //     });
  //   }
  //   return cloneElement(childElement, { data });
  // });
  const childrenCopy = cloneElement(children, { data });
  return childrenCopy;
};

export default UserProvider;
