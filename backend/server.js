import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.action === "play" && data.channel) {
      // Broadcast to all other clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(JSON.stringify(data));
        }
      });
      console.log(`Broadcasted 'play' on channel ${data.channel}`);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("✅ WebSocket server running on ws://localhost:8080");
