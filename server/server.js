import express from "express";
import cookieParser from "cookie-parser";
import { loginRouter } from "./loginRouter.js";
import dotenv from "dotenv";
import * as path from "path";
import fetch from "node-fetch";
const MOVIES = [];

const OPENID_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration";
export const moviesApi = new express.Router();
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
app.use(moviesApi);

app.post("/api/login", (req, res) => {
  const { access_token } = req.body;
  res.cookie("access_token", access_token, { signed: true });
  res.sendStatus(204);
});
app.post("api/login/accessToken", (req, res) => {
  const { access_token } = req.body;
  res.cookie("access_token", access_token, { signed: true });
  console.log("access token signed \n"+access_token);
  res.sendStatus(204);
});
moviesApi.get("/api/movies", (req, res) => {
  const emptyTable = {title: "no movies", id: -1};
  if (MOVIES.length === 0) {
    MOVIES.push(emptyTable);
  }
  else if (MOVIES[0].id === -1 && MOVIES.length > 1) {
    MOVIES.splice(0, 1);
  }
  res.json(MOVIES);

});
moviesApi.post("/api/movies", (req, res) => {
  const { title } = req.body;
  MOVIES.push({ title, id: MOVIES.length });
  res.sendStatus(204);
});




app.get("/api/login", async (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.sendStatus(401);
  }
});
app.use(async (req, res, next) => {
  const authorization = req.header("Authorization");
  if (authorization) {
    const { userinfo_endpoint } = await fetchJSON(
        "https://accounts.google.com/.well-known/openid-configuration"
    );
    req.userinfo = await fetchJSON(userinfo_endpoint, {
      headers: { authorization },
    });
  }
  next();
});
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  res.cookie("username", username, { signed: true });
  res.sendStatus(204);
});

app.post("/api/login/accessToken", (req, res) => {
  const { access_token } = req.body;
  res.cookie("access_token", access_token, { signed: true });
  console.log("access token signed \n"+access_token);
  res.sendStatus(204);
});

app.delete("/api/login", (req, res) => {
  res.clearCookie("username");
  res.clearCookie("access_token");
  res.sendStatus(204);
});
app.listen(process.env.PORT || 3000);
