import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../login/loginContext";
import { socket } from "../../index";
import { ChatRoomSelection } from "./chatRoomSelection";
import { EditChatRoomButton } from "./editChatRoomButton";
import { LoginButton } from "../login/loginButton";

export function ShowChat() {
  const { user, username } = useContext(LoginContext);
  const roomName = new URLSearchParams(window.location.search).get("roomName");
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const nestedElement = document.getElementById("actualChat");
  socket.onmessage = (message) => {
    console.log("from server", message);
    loadChat();
    nestedElement.scrollTo(0, nestedElement.scrollHeight);
  };
  async function loadChat() {
    const chat = await fetch("/api/chat?roomName=" + roomName);
    const room = await fetch("/api/getroom?roomName=" + roomName);
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
      <div className={"chat"} id={"chatDivs"}>
        <div id={"chatRoomHeaders"}>
          <h2>
            {room.roomName} <EditChatRoomButton room={room} />
          </h2>
          <p>{room.description}</p>
        </div>
        <div id={"chatAndRooms"}>
          <ChatRoomSelection />
          <div id={"chatAndInput"}>
            <div id={"actualChat"}>
              {loading && <div>loading chat!</div>}
              {chat.map((m) => (
                <div id={"chatMessageDiv"} key={m._id}>
                  <img id={"chatImg"} src={m.user?.picture} />
                  <div id={"messageText"}>
                    <p id={"chatMessage"}>{m.chatMessage}</p>
                    <footer id={"userName"}>{m.user.username}</footer>
                  </div>
                </div>
              ))}
              <form onSubmit={handleSubmit} id={"chatInput"}>
                <input
                  id={"chatInputField"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Log in to see chat</h2>
        <LoginButton />
      </div>
    );
  }
}
