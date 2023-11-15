import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import * as path from "path";
import fetch from "node-fetch";
import {loginRouter} from "./loginRouter.js";
import {moviesRouter} from "./moviesRouter.js";
let backendUser = null;

const OPENID_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration";
dotenv.config();
async function fetchJson(url, params) {
  const res = await fetch(url, params);
  if (!res.ok) {
    throw new Error("Can't fetch " + url);
  }
  return await res.json();
}

const app = express()
app.use(express.static("../client/dist"));
app.use(express.json());
app.use(cookieParser("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"));
app.use(moviesRouter)
app.use(async (req, res, next) => {
  const { username, access_token } = req.signedCookies;
  if (access_token) {
    const discoveryDocument = await fetchJson(OPENID_DISCOVERY_URL);
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
    req.user = { username: username, email_verified: false };
  }
  next();
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
app.listen(process.env.PORT || 3000);
