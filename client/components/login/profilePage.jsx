import React, {useContext} from "react";
import { LoginContext } from "../login/loginContext";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
    const { reload, user} = useContext(LoginContext);
    const navigate = useNavigate();

    async function handleLogOut(e) {
        e.preventDefault();
        await fetch("/api/login", { method: "DELETE" });
        await reload();
        navigate("/");
    }

    if (user.email_verified === false) {
        return (
            <>
                <h2>User profile</h2>
                <form onSubmit={handleLogOut}>
                    <button>Log out</button>
                </form>
                <div>{user.username}</div>
                <div>email not verified</div>
            </>
        );
    }
    return (
        <>
            <h2>User profile</h2>
            <form onSubmit={handleLogOut}>
                <button>Log out</button>
            </form>
            <img src={user?.picture} />
            <div>{user.name}</div>
            <div>{user.email}</div>

            <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
    );
}