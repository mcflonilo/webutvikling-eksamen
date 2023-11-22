import { Route, Routes } from "react-router-dom";
import React from "react";
import { ShowChat } from "./showChat";
import { LoginPage } from "../login/loginPage";
import { ProfilePage } from "../login/profilePage";
import { LoginCallback } from "../login/loginCallback";
import {ChatRoomSelection} from "./chatRoomSelection";
import {MakeNewChatRoom} from "./makeNewChatRoom";
import {EditChatRoom} from "./editChatRoom";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<h2>front page</h2>} />
      <Route path={"/chat"} element={<ChatRoomSelection />} />
      <Route path={"/login"} element={<LoginPage />} />
      <Route path={"/profile"} element={<ProfilePage />} />
      <Route path={"/login/callback"} element={<LoginCallback />} />
        <Route path={"/chatroom/*"} element={<ShowChat />} />
        <Route path={"/chatroom/create"} element={<MakeNewChatRoom />} />
        <Route path={"/chatroom/edit/*"} element={<EditChatRoom />} />
    </Routes>
  );
}
