import React, {useContext, useState} from "react";
import {LoginContext} from "../login/loginContext";

export function MakeNewChatRoom() {
    const [roomName, setRoomName] = useState("");
    const [description, setDescription] = useState("");
    const { user } = useContext(LoginContext);
    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch("/api/getroom?roomName="+roomName);
        if (!response.ok) {
        await fetch("/api/createroom", {
            method: "POST",
            body: JSON.stringify({
                roomName: roomName,
                description: description,
                user: user }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        }
        else {
            alert("room already exists");
        }
    }

    return (
        <>
            <h2>create new room !!</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    Room name
                    <input
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                </div>
            </form>
            <form onSubmit={handleSubmit}>
                <div>
                    Description
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                </div>
                <div>
                    <button>submit</button>
                </div>
            </form>
        </>
    );
}
