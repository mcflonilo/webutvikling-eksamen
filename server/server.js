import express from "express";
import * as path from "path";
const MOVIES = [];
const app = express();
export const moviesApi = new express.Router();

app.use(express.static("../client/dist"));
app.use(express.json());
app.use(moviesApi);
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
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
app.listen(process.env.PORT || 3000);
