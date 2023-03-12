import mongoose from "mongoose";

export interface LogDoc extends mongoose.Document {
  name: string;
  email: string;
  log: string;
  createdAt?: Date;
}

const logSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    log: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "logs",
  }
);

export const Log = mongoose.model<LogDoc>("Log", logSchema);
