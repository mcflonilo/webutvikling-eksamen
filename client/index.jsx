import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter,Link, Route,Routes} from "react-router-dom";
import {MoviesContext} from "./components/movies/moviesContext";
import {MoviesRoutes} from "./components/movies/moviesRoutes";

const root = ReactDOM.createRoot(document.getElementById("root"));



function Application(){
    const [movies, setMovies] = useState([
        {title: "The Godfather"},
        {title: "The Godfather: Part II"},
        {title: "The Godfather: Part III"},
    ]);
    function fetchMovies(){
        return movies
    }
    function onAddMovie(movie){
        setMovies(oldMovies => [...oldMovies, movie]);
    }
    return (
        <MoviesContext.Provider value={{fetchMovies, onAddMovie}}>
            <header>
                <h1> User Database</h1>
            </header>
            <nav>
                <Link to={"/"}> Front Page</Link>
                <Link to={"/movies/new"}> add movie</Link>
                <Link to={"/movies"}> list movies</Link>
                <Link to={"/"}> event more page</Link>
                <Link to={"/"}> event more page</Link>
            </nav>
            <main>
                <MoviesRoutes />
            </main>
            <footer>jeg har cancer</footer>
        </MoviesContext.Provider>
    )
}
root.render(<BrowserRouter><Application/></BrowserRouter>);