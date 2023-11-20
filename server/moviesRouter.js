import express from "express";
const MOVIES = [];

export const moviesRouter = express.Router();
moviesRouter.get("/api/movies", (req, res) => {
  const emptyTable = { title: "no movies", id: -1 };
  if (MOVIES.length === 0) {
    MOVIES.push(emptyTable);
  } else if (MOVIES[0].id === -1 && MOVIES.length > 1) {
    MOVIES.splice(0, 1);
  }
  res.json(MOVIES);
});
moviesRouter.post("/api/movies", (req, res) => {
  const { title } = req.body;
  MOVIES.push({ title, id: MOVIES.length });
  res.sendStatus(204);
});
