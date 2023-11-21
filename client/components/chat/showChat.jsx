import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../login/loginContext";
import { socket } from "../../index";

export function ShowChat() {
  const [message, setMessage] = useState("");
  const { user } = useContext(LoginContext);
  const { us, username } = React.useContext(LoginContext);
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);

  socket.onmessage = (message) => {
    console.log("from server", message);
    const data = JSON.parse(message.data);
    setChat((oldChat) => [...oldChat, data]);
  };
  async function loadChat() {
    const response = await fetch("/api/chat");
    setLoading(true);
    setChat(await response.json());
    setLoading(false);
  }
  async function handleSubmit(e) {
    socket.send(JSON.stringify({ chatMessage: message, user }));
    e.preventDefault();
    await fetch("/api/sendChat", {
      method: "POST",
      body: JSON.stringify({ chatMessage: message, user }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  useEffect(() => {
    loadChat();
  }, []);

  if (us || username) {
    return (
      <>
        <h2>Epic chat function!!</h2>
        {loading && <div>loading chat!</div>}
        {chat.map((m) => (
          <div id={"chatMessage"} key={m._id}>
            <img id={"chatImg"} src={m.user?.picture} />
            {m.chatMessage} sendt by {m.user.username}
          </div>
        ))}
        <form onSubmit={handleSubmit} id={"chat"}>
          <div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div>
            <button>submit</button>
          </div>
        </form>
      </>
    );
  } else {
    return (
      <>
        <h2>log in to see chat</h2>
      </>
    );
  }
}
