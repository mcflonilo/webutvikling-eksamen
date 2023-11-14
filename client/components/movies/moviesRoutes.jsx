import { Route, Routes } from "react-router-dom";
import React from "react";
import { MoviesList } from "./moviesList";
import { AddMovieForm } from "./addMovieForm";

export function MoviesRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<h2>front page</h2>} />
      <Route path={"/movies"} element={<MoviesList />} />
      <Route path={"/movies/new"} element={<AddMovieForm />} />
      <Route path={"/*"} element={<h2>not found</h2>} />
    </Routes>
  );
}
