import React, { useState } from "react";
export function AddMovieForm() {
  const [title, setTitle] = useState("");

  // sender en post request til serveren
  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/movies", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: {
        "Content-Type": "application/json",
      },
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
