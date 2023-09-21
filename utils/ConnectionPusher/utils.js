import PusherClient from "pusher-js";
import { toPusherKey } from "../toPusherKey";

let pusherClient;
let presenceChannel;

const pusherClientChannel = (userInfo) => {
  const { id, username, email, membership } = userInfo;
  return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
    cluster: "us2",
    channelAuthorization: {
      params: { id, username, email, membership },
      endpoint: "/api/pusher/auth",
    },
  });
};

export const presenceChannelBinder = (userInfo, fns) => {
  pusherClient = pusherClientChannel(userInfo);
  presenceChannel = pusherClient.subscribe(
    toPusherKey("presence-connection:active")
  );
  if (presenceChannel && fns) {
    presenceChannel.bind(
      "pusher:subscription_succeeded",
      fns.connectionSucceed
    );
    presenceChannel.bind("pusher:subscription_error", fns.connectionError);
    presenceChannel.bind("pusher:member_added", fns.addMember);
    presenceChannel.bind("pusher:member_removed", fns.removeMember);
  }
};

export const presenceChannelUnBinder = (fns) => {
  if (presenceChannel && fns) {
    pusherClient.unsubscribe(toPusherKey("presence-connection:active"));
    presenceChannel.unbind(
      "pusher:subscription_succeeded",
      fns.connectionSucceed
    );
    presenceChannel.unbind(
      "pusher:subscription_succeeded",
      fns.connectionSucceed
    );
    presenceChannel.unbind("pusher:member_added", fns.addMember);
  }
};
