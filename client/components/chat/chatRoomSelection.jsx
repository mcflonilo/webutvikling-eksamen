import React, {useContext, useEffect, useState} from "react";

export function ChatRoomSelection() {
  const [chatRooms, setChatRooms] = useState([]);
  async function loadChatRooms() {
    const response = await fetch("/api/getrooms");
    setChatRooms(await response.json());
  }
    useEffect(() => {
        loadChatRooms();
    }, []);
  return (
      <>
        <h2>select chatroom</h2>
        {chatRooms.map((m) => (
            <div key={m._id}><a href={window.location.origin+"/chatroom?roomName="+m.roomName}>{m.roomName}</a></div>
        ))}
      </>
  );
}
