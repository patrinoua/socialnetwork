import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "axios";
import { Logo, Login } from "./welcome";
import { ProfilePic } from "./profile";
import { OnlineUsers } from "./onlineUsers";
import Chat from "./chat";

export default function Navigation(props) {
    return (
        <div id="navigation">
            <Logo />
            <Link to="/user">Hello {props.first}</Link>
            <a href="/logout"> Logout </a>
            <Link to="/onlineUsers">Online</Link>
            <Link to="/friends"> Friends</Link>
            <Link to="/chat"> Chat </Link>
            <ProfilePic {...props} />
        </div>
    );
}
