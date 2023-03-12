import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Log } from "./models/Log.js";

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

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

app.post("/api/submit-log-report", async (req, res) => {
  console.log("Request body:", req.body);
  const { name, email, log } = req.body;

  // Process the log
  const processedLog = log
    .split("\n")
    .filter((line) => /^([IEW])\s(\d+)\s(.+)$/.test(line))
    .map((line) => {
      const [type, severity, content] = line.split(" ");
      return { type, severity, content };
    })
    .filter((line) => {
      const severity = Number(line.severity);
      return line.type === "E" && severity >= 50 && severity <= 100;
    });

  console.log(
    "Name:",
    name,
    "Email:",
    email,
    "Log:",
    log,
    "Processed Log:",
    processedLog
  );

  const newLog = new Log({
    name,
    email,
    log,
    processedLog,
  });

  try {
    await newLog.save();
    console.log("Log saved successfully");
    res.json({ message: "Log report submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save log report" });
  }
});
