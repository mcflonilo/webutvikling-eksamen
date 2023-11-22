import React from "react";
import {LoginButton} from "../login/loginButton";

export class FrontPage extends React.Component {
    render() {
        return (
            <div id={"frontPage"}>
                <h2>Front page</h2>
                <p>
                    To get started,
                    you have to log in,
                    you can just use a username to chat.
                    But if you want to create a chatroom,
                    you have to log in with google.
                </p>
                <LoginButton />
            </div>


    );
    }
}