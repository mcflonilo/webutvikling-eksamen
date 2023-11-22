import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export function EditChatRoom() {
  const oldName = new URLSearchParams(window.location.search).get("roomName");
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("/api/getroom");
    if (!response.ok) {
      console.log("oldName: " + oldName);
      console.log("roomName: " + roomName);
      console.log("description: " + description);
      await fetch("/api/getroom?roomName=" + roomName, {
        method: "PUT",
        body: JSON.stringify({
          roomName: roomName,
          description: description,
          oldName: oldName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setDescription("");
      setRoomName("");
      navigate("/chatroom?roomName=" + roomName);
    } else {
      alert("room name taken");
    }
  }

  return (
    <div>
      <h2>edit chatroom</h2>
      <form onSubmit={handleSubmit}>
        <div>
          new room name
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>
      </form>
      <form onSubmit={handleSubmit}>
        <div>
          new description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <button>submit</button>
        </div>
      </form>
    </div>
  );
}
