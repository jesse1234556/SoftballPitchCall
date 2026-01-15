import { WebSocketServer } from "ws";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (msg) => {
    console.log("Received message from client:", msg.toString());

    let data;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      console.warn("Received invalid JSON:", msg);
      return;
    }

    // Heartbeat ping/pong
    if (data.type === "ping") {
      console.log("Ping received from client");
      ws.send(JSON.stringify({ type: "pong" }));
      return;
    }

    // Broadcast play messages to all other clients
    if (data.action === "play" && data.channel) {
      console.log(
        `Play message received for channel ${data.channel}, files: ${data.files}`
      );

      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          console.log("Sending play message to another client");
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});
