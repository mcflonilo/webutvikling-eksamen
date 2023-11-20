import React, { useContext, useState } from "react";
import { LoginContext } from "../login/loginContext";
export function AddMovieForm() {
  const [title, setTitle] = useState("");
  const { user } = useContext(LoginContext);

  // sender en post request til serveren
  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/movies", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: {
        "Content-Type": "application/json",
      },
      async reload() {},
    });
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add movie</h2>
      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <button>submit</button>
      </div>
    </form>
  );
}
