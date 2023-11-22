import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../login/loginContext";
import { socket } from "../../index";
import {ChatRoomSelection} from "./chatRoomSelection";
import {EditChatRoomButton} from "./editChatRoomButton";

export function ShowChat() {
  const { user, username } = useContext(LoginContext);
  const roomName = new URLSearchParams(window.location.search).get("roomName");
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);

  socket.onmessage = (message) => {
    console.log("from server", message);
    const data = JSON.parse(message.data);
    setChat((oldChat) => [...oldChat, data]);
  };
  async function loadChat() {
    const chat = await fetch("/api/chat?roomName="+roomName);
    const room = await fetch("/api/getroom?roomName="+roomName);
    setLoading(true);
    setChat(await chat.json());
    setRoom(await room.json());
    setLoading(false);
  }
  async function handleSubmit(e) {
    socket.send(JSON.stringify({ chatMessage: message, user, roomName }));
    e.preventDefault();
    await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ chatMessage: message, user, roomName }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setMessage("");
  }

  useEffect(() => {
    loadChat();
  }, []);

  if (user || username) {
    return (
      <div id={"chatDivs"}>
        <div id={"chatrooms"}>
          <ChatRoomSelection></ChatRoomSelection>
        </div>
        <div>
          <h2>{room.roomName} <EditChatRoomButton room={room}/></h2>
          <p>{room.description}</p>
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
        </div>

      </div>
    );
  } else {
    return (
      <>
        <h2>log in to see chat</h2>
      </>
    );
  }
}
