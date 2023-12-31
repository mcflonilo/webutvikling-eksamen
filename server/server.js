import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import * as path from "path";
import fetch from "node-fetch";
import { loginRouter } from "./loginRouter.js";
import { chatApi } from "./chatApi.js";
import { WebSocketServer } from "ws";
import { MongoClient } from "mongodb";

dotenv.config({ path: "../.env" });

const cookieParserSecret = process.env.COOKIE_PARSER_SECRET;
const openID_url = process.env.OPENID_DISCOVERY_URL;
const app = express();
const server = app.listen(process.env.PORT || 3000);
const sockets = [];
const wsServer = new WebSocketServer({ noServer: true });

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);
client.connect().then(async () => {
  app.use(chatApi(client.db("chat")));
  console.log("Connected to database");
});
app.use(express.static("../client/dist"));
app.use(express.json());
app.use(cookieParser(cookieParserSecret));
app.use(async (req, res, next) => {
  const { username, access_token } = req.signedCookies;
  if (access_token) {
    const discoveryDocument = await fetchJson(openID_url);
    const { userinfo_endpoint } = discoveryDocument;
    const user = await fetchJson(userinfo_endpoint, {
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    });
    console.log(user);

    const { given_name, family_name } = user;
    const username = `${given_name} ${family_name}`;
    req.user = { ...user, username };
  } else if (username) {
    req.user = {
      username: username,
      email_verified: false,
      picture: "/img/otlqo1ek.png",
    };
  }
  next();
});
app.get("/img/otlqo1ek.png", (req, res) => {
  res.sendFile("img/otlqo1ek.png", { root: ".." });
});
app.use("/api/login", loginRouter);
app.use(express.static("../client/dist"));
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    sockets.push(socket);
    socket.on("message", (message) => {
      const { chatMessage, user } = JSON.parse(message);
      for (let i = 0; i < sockets.length; i++) {
        sockets[i].send(JSON.stringify({ chatMessage, user }));
      }
    });
  });
});

async function fetchJson(url, params) {
  const res = await fetch(url, params);
  if (!res.ok) {
    console.log(res);
    throw new Error("Can't fetch " + url);
  }
  return await res.json();
}
