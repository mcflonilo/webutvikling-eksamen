import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./loginContext";
import dotenv from "dotenv";
dotenv.config();

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Can't fetch " + url);
  }
  return await res.json();
}

function LoginWithOauthButton() {
  const [authorizationUrl, setAuthorizationUrl] = useState();
  async function generateAuthorizationUrl() {
    const discoveryDoc = await fetchJson(process.env.OPENID_DISCOVERY_URL);
    const parameters = {
      response_type: "token",
      client_id: process.env.CLIENT_ID,
      redirect_uri: window.location.origin + "/login/callback",
      scope: "profile email",
    };
    setAuthorizationUrl(
      discoveryDoc.authorization_endpoint +
        "?" +
        new URLSearchParams(parameters),
    );
  }
  useEffect(() => {
    generateAuthorizationUrl();
  }, []);

  return <a href={authorizationUrl}>Log in with Google</a>;
}

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { reload } = useContext(LoginContext);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "content-type": "application/json",
      },
    });
    await reload();
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <LoginWithOauthButton />
      <h2>Login page</h2>
      <div>
        Username <br />
        <input
          autoFocus={true}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        Password <br />
        <input
          type={"password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button>Log in</button>
      </div>

      <pre>{JSON.stringify({ username, password })}</pre>
    </form>
  );
}
