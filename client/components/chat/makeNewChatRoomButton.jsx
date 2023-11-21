import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { LoginContext } from "../login/loginContext";

export function MakeNewChatRoomButton() {
  const { user } = useContext(LoginContext);
  if (user) {
    return <Link to={"/chatroom/create"}>make new chatroom!</Link>;
  }
  return <></>;
}
