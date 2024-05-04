import user_photo from "../../assets/user.png";
import React from "react";

type Client = {
  id?: string;
  username: string;
  photo_url: string;
};

export default function Client(client: Client) {
  return (
    <div className="flex items-center bg-base custom-shadow roundex-2xl p-2 px-4">
      <div>
        <img
          src={client.photo_url !== "" ? client.photo_url : user_photo}
          alt="User"
          className="h-8 w-8 md:h-12 md:w-12 rounded-lg"
        />
      </div>
      <div className="flex-grow flex flex-col px-6 py-4">
        <div className="font-bold">{client.username}</div>
      </div>
    </div>
  );
}
