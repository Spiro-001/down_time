import React from "react";
import SignOutButton from "./SignOutButton";

const Nav = () => {
  return (
    <nav className="bg-red-100 w-full flex justify-end gap-x-4 px-4 py-4">
      <div>profile</div>
      <SignOutButton />
    </nav>
  );
};

export default Nav;
