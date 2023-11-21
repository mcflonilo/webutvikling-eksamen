import express from "express";
import {WebSocketServer} from "ws";
import app from "express/lib/application.js";
const MOVIES = [];

export const moviesRouter = express.Router();
moviesRouter.get("/api/chat", (req, res) => {
  const emptyTable = { chatMessage: "send a message to start a chat :)", id: -1, user: "empty user" };
  if (MOVIES.length === 0) {
    MOVIES.push(emptyTable);
  } else if (MOVIES[0].id === -1 && MOVIES.length > 1) {
    MOVIES.splice(0, 1);
  }
  res.json(MOVIES);
});
moviesRouter.post("/api/sendChat", (req, res) => {
  const { chatMessage , user} = req.body;
  MOVIES.push({ chatMessage, user, id: MOVIES.length });
  res.sendStatus(204);
});
