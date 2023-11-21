import React, { useContext, useState } from "react";
import { LoginContext } from "../login/loginContext";
export function SendChatForm() {
  const [message, setMessage] = useState("");
  const { user } = useContext(LoginContext);

  // sender en post request til serveren
  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/sendChat", {
      method: "POST",
      body: JSON.stringify({ chatMessage: message, user}),
      headers: {
        "Content-Type": "application/json",
      },
      async reload() {},
    });
  }
  return (
    <form onSubmit={handleSubmit} id={"chat"}>
      <div>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <div>
        <button>submit</button>
      </div>
    </form>
  );
}
