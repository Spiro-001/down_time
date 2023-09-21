"use client";

import React from "react";

const MemberType = ({ membership }) => {
  return (
    <div className="bg-white w-full max-w-[300px] p-4 flex flex-col capitalize gap-y-4 rounded-md shadow-sm">
      <span className="text-lg font-semibold bg-red-100 w-fit rounded-md px-4 py-1">
        Membership Type
      </span>
      <div className="flex justify-between items-center">
        <span className="bg-purple-200 w-fit px-3 py-1 rounded-md">
          {membership}
        </span>
        <span>Upgrade</span>
      </div>
    </div>
  );
};

export default MemberType;
