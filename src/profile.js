import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "axios";
import { Logo, Login } from "./welcome";
import { EditBio, ExistingBio } from "./bio";

export class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.pic = this.props.profilePic;
        this.toggleBioEditor = this.toggleBioEditor.bind(this);
        this.submitNewBioButton = this.submitNewBioButton.bind(this);
        this.editBioButton = this.editBioButton.bind(this);
        this.changeBio = this.changeBio.bind(this);
    }
    toggleBioEditor() {
        this.setState({
            editBioIsVisible: !this.state.editBioIsVisible
        });
    }
    submitNewBioButton() {
        this.setState({
            editBioIsVisible: !this.state.editBioIsVisible
        });
    }
    editBioButton() {
        this.setState({
            editBioIsVisible: !this.state.editBioIsVisible
        });
    }

    changeBio(newBio) {
        console.log("let us try this and go to bed", newBio);
        this.setState({
            bio: newBio
        });
    }

    render() {
        let pic = this.props.profilePic;

        if (!pic) {
            pic = "/neo.png";
        }

        let bio = this.props.bio;
        if (this.state.bio) {
            bio = this.state.bio;
        }
        return (
            <div className="profileContainer">
                <div className="pictureContainer">
                    <div className="profilePic">
                        <img src={pic} />
                    </div>
                </div>
                {this.state.editBioIsVisible ? (
                    <EditBio
                        bio={bio}
                        edit={this.editBioButton}
                        toggleBioEditor={this.toggleBioEditor}
                        saveNewBio={this.saveNewBio}
                        changeBio={this.changeBio}
                    />
                ) : (
                    <ExistingBio
                        bio={bio}
                        toggleBioEditor={this.toggleBioEditor}
                        submit={this.submitNewBioButton}
                        changeBio={this.changeBio}
                    />
                )}
            </div>
        );
    }
}

export function ProfilePic(props) {
    let pic = props.profilePic;
    function toggleUploader() {
        props.toggleUploader();
    }
    if (!pic) {
        pic = "/neo.png";
    }
    return <img src={pic} className="userImage" onClick={toggleUploader} />;
}

export function UploadProfilePic(props) {
    console.log("props in upload Profile pic", props);
    let pic = props.profilePic;
    let file;

    function getFile(e) {
        file = e.target.files[0];
    }
    function upload() {
        var formData = new FormData();
        var app = this;
        formData.append("file", file);
        axios.post("/updateProfilePic", formData).then(response => {
            console.log("response: ", response);
            if (response.data.success) {
                props.changeImage(response.data.imageUrl);
                console.log("response.data", response.data);
                props.toggleUploader();
            }
        });
    }
    function closePopUp() {
        props.hideUploader();
        props.toggleUploader();
    }
    if (!pic) {
        pic = "/neo.png";
    }
    return (
        <div className="uploader">
            <div className="centerText"> Change profile picture? </div>
            <input type="file" className="inputButton" onChange={getFile} />
            <button type="button" onClick={upload}>
                {" "}
                Upload{" "}
            </button>
            <button type="button" onClick={closePopUp}>
                {" "}
                Cancel{" "}
            </button>
        </div>
    );
}
