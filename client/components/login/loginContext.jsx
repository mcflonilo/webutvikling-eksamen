import React from "react";

export const LoginContext = React.createContext({
    user: undefined,
    username: undefined,
    async reload() {},
});