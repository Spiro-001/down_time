"use client";

import { signIn } from "next-auth/react";
import React from "react";

const GoogleSignInButton = () => {
  const handleClick = () => {
    signIn("google");
  };
  return <button onClick={handleClick}>GoogleSignInButton</button>;
};

export default GoogleSignInButton;
