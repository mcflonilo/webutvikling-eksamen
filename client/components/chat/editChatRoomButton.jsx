import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { LoginContext } from "../login/loginContext";

export function EditChatRoomButton({room}) {

  const { user } = useContext(LoginContext);
  if (user != null && room != null && room.user != null) {
    if (user.email_verified === true && room.user.username === user.username) {
      return <Link to={"/chatroom/edit?roomName="+room.roomName}><i className='fas fa-edit'>ww</i></Link>;
    }
  }

  return <></>;
}
