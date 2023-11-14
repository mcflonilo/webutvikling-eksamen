import React, {useState, useContext, useEffect} from "react";
import {MoviesContext} from "./moviesContext";

export function MoviesList() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const {fetchMovies} = useContext(MoviesContext);
    async function loadMovies(){
        setLoading(true);
        setMovies(await fetchMovies());
        setLoading(false);
    }
    useEffect(() => {
        loadMovies();
    }, []);

    return <>
        <h2>list movies</h2>
        {loading && <div>spinner</div>}
        {movies.map((m) => (
            <div key={m._id}>{m.title}</div>
        ))}
        </>;
}