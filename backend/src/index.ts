import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Log } from "./models/Log.js";
import WebSocket, { WebSocketServer } from "ws";

const app = express();

app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://szumi112:szumek112@clusterlogin.zx7urtn.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Create regular API server listening on port 3000
app.listen(3000, () => {
  console.log("Regular API server listening on port 3000");
});

// Create WebSocket server listening on port 8080
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // Send logs with severity of 50 or higher to the client on connection
  Log.find({
    processedLog: { $regex: /^[IEW]\s[5-9][0-9]|[1-9][0-9]{2}/ },
  })
    .then((logs) => {
      ws.send(JSON.stringify(logs));
    })
    .catch((err) => {
      console.error(err);
      ws.send(JSON.stringify({ error: "Failed to retrieve logs" }));
    });
});

app.post("/api/submit-log-report", async (req, res) => {
  const { name, email, log } = req.body;

  const processedLog = log
    .split("\n")
    .filter((line) => /^[IEW]\s[1-9][0-9]?\s(.+)$/.test(line))
    .map((line) => {
      const [type, severity, ...messageParts] = line.split(" ");
      const message = messageParts.join(" ");
      return `${type} ${severity} ${message}`;
    })
    .join("\n");

  if (!processedLog) {
    return res
      .status(400)
      .json({ error: "Log report does not meet the requirements" });
  }

  const newLog = new Log({
    name,
    email,
    processedLog,
  });

  try {
    await newLog.save();
    console.log("Log saved successfully");

    // Send new log with severity of 50 or higher to all WebSocket clients
    const logs = await Log.find({
      processedLog: { $regex: /^[IEW]\s[5-9][0-9]|[1-9][0-9]{2}/ },
    });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(logs));
      }
    });

    res.json({ message: "Log report submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save log report" });
  }
});

app.get("/api/logs", async (req, res) => {
  try {
    const logs = await Log.find({
      processedLog: { $regex: /^[IEW]\s[5-9][0-9]|[1-9][0-9]{2}/ },
    });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve logs" });
  }
});

// Log.deleteMany({})
//   .then(() => console.log("Logs collection cleared"))
//   .catch((err) => console.error(err));
