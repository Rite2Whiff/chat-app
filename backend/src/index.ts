import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", function (socket) {
  socket.send("user connected");
  socket.on("message", function (message) {
    // @ts-ignore
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === "join") {
      const user = {
        socket,
        room: parsedMessage.payload.roomId,
      };
      allSockets.push(user);
    }
    if (parsedMessage.type === "chat") {
      const currentRooms = allSockets.filter(
        (item) => item.room == parsedMessage.payload.roomId
      );
      currentRooms.forEach((item) =>
        item.socket.send(parsedMessage.payload.message.toString())
      );
    }
  });
});
