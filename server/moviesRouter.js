import express from "express";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
export let messages = [];
dotenv.config({ path: "../.env" });

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);
let db;
client.connect().then((connection) => {
    db = connection.db("chat");
});

export const moviesRouter = express.Router();
moviesRouter.get("/api/chat", async (req, res) => {
    const { roomName } = req.query;
  messages = await db
      .collection("messages")
        .find()
        .filter({roomName:roomName})
        .toArray();
    res.json(messages);
  });

  moviesRouter.post("/api/chat", async (req, res) => {
    const { chatMessage , user, roomName} = req.body;
    await db
        .collection("messages")
        .insertOne({ chatMessage, user, roomName});
    res.sendStatus(204);
  });

moviesRouter.post("/api/createroom", async (req, res) => {
  const { roomName , description} = req.body;
  await db
      .collection("chatRooms")
      .insertOne({ roomName, description});
  res.sendStatus(204);
});
moviesRouter.get("/api/getrooms", async (req, res) => {
  const rooms = await db.collection("chatRooms")
      .find()
      .toArray();
  res.json(rooms);
});