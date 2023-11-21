import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link } from "react-router-dom";
import { AppRoutes } from "./components/chat/AppRoutes";
import { LoginButton } from "./components/login/loginButton";
import { LoginContext } from "./components/login/loginContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
import "./application.css";
export const socket = new WebSocket(
  window.location.origin.replace(/^http/, "ws"),
);
socket.onopen = () => {
  console.log("connected");
};

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
    <LoginContext.Provider
      value={{ username: user?.username, user, reload: fetchUser }}
    >
      <header>
        <h1> User Database</h1>
      </header>
      <nav>
        <Link to={"/"}> Front Page</Link>
        <Link to={"/chat"}> chat </Link>
        <LoginButton />
      </nav>
      <main>
        <AppRoutes />
      </main>
    </LoginContext.Provider>
  );
}
root.render(
  <BrowserRouter>
    <Application />
  </BrowserRouter>,
);
