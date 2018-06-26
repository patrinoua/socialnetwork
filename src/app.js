import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, HashRouter, Route } from "react-router-dom";

import { Welcome, Logo, Login } from "./welcome";
import axios from "axios";
import { ProfilePage, ProfilePic, UploadProfilePic, EditBio } from "./profile";
import Navigation from "./navigation";
import { OtherProfilePage } from "./otherProfile";
import Friends from "./friends";
import { composeWithDevTools } from "redux-devtools-extension";
import OnlineUsers from "./onlineUsers";
import Chat from "./chat";

// import { EditBio , ExistingBio } from './bio';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.fileToUpload = {};
        this.state.toggleUploader = false;
    }

    toggleUploader() {
        this.setState({
            toggleUploader: !this.state.toggleUploader
        });
    }
    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }
    changeImage(img) {
        this.setState({
            profilePic: img,
            uploaderIsVisible: false
        });
    }
    hideUploader() {
        console.log("hiding uploader...");
        this.setState({
            uploaderIsVisible: false
        });
    }
    componentDidMount() {
        axios.get("/getUser").then(response => {
            if (response.data.success) {
                // console.log("response.data.user?????",response.data.user);
                this.setState(response.data.user);
            } else {
                console.log(
                    "response.data in getUser had an error ",
                    response.data
                );
            }
        });
    }
    componentWillReceiveProps() {
        console.log("inside componentWillReceiveProps");
    }
    render() {
        if (!this.state.first) {
            return (
                <div>
                    <p> LOADING </p>
                </div>
            );
        }
        return (
            <div>
                <BrowserRouter>
                    <div className="container">
                        <Navigation
                            {...this.state}
                            toggleUploader={this.toggleUploader}
                            makeUploaderVisible={this.showUploader}
                            hideUploader={this.hideUploader}
                        />
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <ProfilePage
                                    {...this.state}
                                    toggleUploader={this.toggleUploader}
                                    makeUploaderVisible={this.showUploader}
                                    hideUploader={this.hideUploader}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/user"
                            render={() => (
                                <ProfilePage
                                    {...this.state}
                                    toggleUploader={this.toggleUploader}
                                    makeUploaderVisible={this.showUploader}
                                    hideUploader={this.hideUploader}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/user/:id"
                            component={OtherProfilePage}
                        />

                        <Route exact path="/friends" component={Friends} />

                        <Route
                            exact
                            path="/onlineUsers"
                            component={OnlineUsers}
                        />
                        <Route exact path="/chat" component={Chat} />
                    </div>
                </BrowserRouter>
                {this.state.toggleUploader && (
                    <UploadProfilePic
                        changeImage={this.changeImage}
                        hideUploader={this.hideUploader}
                        toggleUploader={this.toggleUploader}
                    />
                )}
            </div>
        );
    }
}
