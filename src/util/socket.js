import openSocket from "socket.io-client";
let client;

export const getSocket = () => {
  if (!client) {
    client = openSocket(`${process.env.REACT_APP_KIOSK_BACKEND_BASEURL}`, {
      transports: ["websocket"],
    });
  }
  return client;
};
