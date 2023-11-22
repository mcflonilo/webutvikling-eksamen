import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
export let messages = [];
dotenv.config({ path: "../.env" });
export function chatApi(db){
  const chatApi = express.Router();
  //henter alle meldinger fra ett rom fra databasen

  chatApi.get("/api/chat", async (req, res) => {
    const { roomName } = req.query;
    messages = await db
        .collection("messages")
        .find()
        .filter({ roomName: roomName })
        .toArray();
    res.json(messages);
  });

//legger til en melding til databasen
  chatApi.post("/api/chat", async (req, res) => {

    const { chatMessage, user, roomName } = req.body;
    console.log("chatMessage = " + user)
    await db.collection("messages").insertOne({ chatMessage, user, roomName });
    res.sendStatus(200);
  });

//legger til et rom til databasen
  chatApi.post("/api/createroom", async (req, res) => {
    const { roomName, description, user } = req.body;
    await db.collection("chatRooms").insertOne({ roomName, description, user });
    res.sendStatus(204);
  });
//henter alle rom fra databasen
  chatApi.get("/api/getrooms", async (req, res) => {
    const rooms = await db.collection("chatRooms").find().toArray();
    res.json(rooms);
  });

//finner ett rom fra databasen
  chatApi.get("/api/getroom", async (req, res) => {
    const { roomName } = req.query;
    const room = await db.collection("chatRooms").findOne({ roomName: roomName });
    console.log(room);
    if (room === null) {
      res.sendStatus(404);
      return;
    }
    res.json(room);
  });
//finner ett rom fra databasen
  chatApi.put("/api/getroom", async (req, res) => {
    const { roomName, oldName, description } = req.body;
    console.log("roomName = " + roomName);
    console.log("oldName = " + oldName);
    console.log("description = " + description);

    const newRoom = await db
        .collection("chatRooms")
        .updateOne(
            { roomName: oldName },
            { $set: { roomName: roomName, description: description } },
        );
    const messages = await db
        .collection("messages")
        .updateMany({ roomName: oldName }, { $set: { roomName: roomName } });
    console.log(newRoom);
    console.log(messages);
    res.sendStatus(204);
  });

  return chatApi;
}
