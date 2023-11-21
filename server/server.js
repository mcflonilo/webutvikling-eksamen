import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import * as path from "path";
import fetch from "node-fetch";
import { loginRouter } from "./loginRouter.js";
import { moviesRouter } from "./moviesRouter.js";
import { WebSocketServer } from "ws";



let backendUser = null;
dotenv.config({ path: "../.env" });
async function fetchJson(url, params) {
  const res = await fetch(url, params);
  if (!res.ok) {
    console.log(res);
    throw new Error("Can't fetch " + url);
  }
  return await res.json();
}

const cookieParserSecret = process.env.COOKIE_PARSER_SECRET;
const openID_url = process.env.OPENID_DISCOVERY_URL;
const app = express();
app.use(express.static("../client/dist"));
app.use(express.json());
app.use(cookieParser(cookieParserSecret));
app.use(moviesRouter);
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
    req.user = { username: username, email_verified: false , picture: "/img/otlqo1ek.png"};
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
const server = app.listen(process.env.PORT || 3000);
const sockets = [];
const wsServer = new WebSocketServer({ noServer: true });
server.on("upgrade", (req,socket,head) => {
  wsServer.handleUpgrade(req, socket, head, socket => {
    console.log("adding socket");
    sockets.push(socket);
    socket.on("message", (message) => {
      const {chatMessage, user} = JSON.parse(message);
      for (let i = 0; i < sockets.length; i++)
      {
        sockets[i].send(JSON.stringify({chatMessage, user}));
        console.log("pushing to socket: "+ i  + message);

      }
      });

    });
    });

