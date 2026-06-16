import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const socketUrl = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

let socket;

export function getSocket() {
  const token = localStorage.getItem("kisan_token");

  if (!token) {
    return null;
  }

  if (!socket) {
    socket = io(socketUrl, {
      autoConnect: false,
      auth: { token },
    });
  } else {
    socket.auth = { token };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
