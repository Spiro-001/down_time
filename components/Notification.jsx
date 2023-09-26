import Image from "next/image";
import React from "react";

const Notifications = () => {
  return (
    <div className="ml-auto mt-auto bg-white py-4 px-6 flex gap-x-8 rounded-md shadow-sm h-fit">
      <span>
        <Image src="/comments.png" width={25} height={25} />
      </span>
      <span>
        <Image src="/globe.png" width={25} height={25} />
      </span>
    </div>
  );
};

export default Notifications;
