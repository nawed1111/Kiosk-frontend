import openSocket from "socket.io-client";
let client;

export const getSocket = () => {
  if (!client) {
    client = openSocket("http://localhost:5000", {
      transports: ["websocket"],
    });
  }
  return client;
};

