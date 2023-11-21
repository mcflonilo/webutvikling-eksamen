import React, { useState, useEffect } from "react";
import {SendChatForm} from "./sendChatForm";
import { LoginContext } from "../login/loginContext";

export function ShowChat() {
    const { us, username } = React.useContext(LoginContext);
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);
  async function loadChat() {
    const response = await fetch("/api/chat");
    setLoading(true);
    setChat(await response.json());
    setLoading(false);
  }

  useEffect(() => {
    loadChat();
  }, []);

  if (us || username){
  return (
    <>
      <h2>Epic chat function!!</h2>
      {loading && <div>loading chat!</div>}
      {chat.map((m) => (

        <div id={"chatMessage"} key={m._id}><img id={"chatImg"} src={m.user?.picture}/>{m.chatMessage} sendt by {m.user.username}</div>
      ))}
      <SendChatForm></SendChatForm>
    </>
  );

  } else {
    return (
        <>
            <h2>log in to see chat</h2>
          </>);
  }
}
