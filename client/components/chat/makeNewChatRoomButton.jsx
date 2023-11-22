import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { LoginContext } from "../login/loginContext";

export function MakeNewChatRoomButton() {
  const { user } = useContext(LoginContext);
  if (user != null) {
    if (user.email_verified === true) {
      return <Link to={"/chatroom/create"}>Make new chatroom!</Link>;
    }
  }

  return <></>;
}
