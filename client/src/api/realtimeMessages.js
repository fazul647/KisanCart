import { getSocket } from "./socket";

export function sendRealtimeMessage(payload) {
  return new Promise((resolve, reject) => {
    const socket = getSocket();

    if (!socket) {
      reject(new Error("You must be logged in to send messages"));
      return;
    }

    socket.timeout(7000).emit("message:send", payload, (err, response) => {
      if (err) {
        reject(new Error("Realtime message timed out"));
        return;
      }

      if (!response?.ok) {
        reject(new Error(response?.error?.message || "Failed to send message"));
        return;
      }

      resolve(response.message);
    });
  });
}
