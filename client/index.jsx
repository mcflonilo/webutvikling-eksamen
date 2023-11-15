import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link} from "react-router-dom";
import { AppRoutes } from "./components/movies/AppRoutes";
import {LoginButton} from "./components/login/loginButton";
import {LoginContext} from "./components/login/loginContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
import "./application.css";


function Application() {
    const [user, setUser] = useState();

    async function fetchUser() {
        const res = await fetch("/api/login");
        if (res.status === 401) {
            setUser(undefined);
        } else {
            const user = await res.json();
            setUser(user);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);
    return (
        <LoginContext.Provider value={{ username: user?.username, user, reload: fetchUser }}>
            <header>
                <h1> User Database</h1>
            </header>
            <nav>
                <Link to={"/"}> Front Page</Link>
                <Link to={"/movies/new"}> add movie</Link>
                <Link to={"/movies"}> list movies</Link>
                <LoginButton/>
            </nav>
            <main>
                <AppRoutes />

            </main>
            <footer>jeg har cancer</footer>
            </LoginContext.Provider>);
}
root.render(
    <BrowserRouter>
        <Application />
    </BrowserRouter>,);
