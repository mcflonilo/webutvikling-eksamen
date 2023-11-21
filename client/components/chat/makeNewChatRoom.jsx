import React, {useContext, useState} from "react";

export function MakeNewChatRoom() {
    const [roomName, setRoomName] = useState("");
    const [description, setDescription] = useState("");
    async function handleSubmit(e) {
        e.preventDefault();
        await fetch("/api/createroom", {
            method: "POST",
            body: JSON.stringify({ roomName: roomName, description: description }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    return (
        <>
            <h2>create new room !!</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                </div>

                <div>
                    <button>submit</button>
                </div>
            </form>
            <form onSubmit={handleSubmit}>
                <div>
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
