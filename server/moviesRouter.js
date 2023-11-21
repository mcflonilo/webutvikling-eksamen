import express from "express";
export const messages = [];

export const moviesRouter = express.Router();
moviesRouter.get("/api/chat", (req, res) => {
  const emptyTable = {
    chatMessage: "send a message to start a chat :)",
    id: -1,
    user: "empty user",
  };
  if (messages.length === 0) {
    messages.push(emptyTable);
  } else if (messages[0].id === -1 && messages.length > 1) {
    messages.splice(0, 1);
  }
  res.json(messages);
});
moviesRouter.post("/api/sendChat", (req, res) => {
  const { chatMessage, user } = req.body;
  messages.push({ chatMessage, user, id: messages.length });
  res.sendStatus(204);
});
