import { Route, Routes } from "react-router-dom";
import React from "react";
import { ShowChat } from "./showChat";
import { LoginPage } from "../login/loginPage";
import { ProfilePage } from "../login/profilePage";
import { LoginCallback } from "../login/loginCallback";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={"/"} element={<h2>front page</h2>} />
      <Route path={"/chat"} element={<ShowChat />} />
      <Route path={"/login"} element={<LoginPage />} />
      <Route path={"/profile"} element={<ProfilePage />} />
      <Route path={"/login/callback"} element={<LoginCallback />} />
    </Routes>
  );
}