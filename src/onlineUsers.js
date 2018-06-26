import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

class OnlineUsers extends React.Component {
    render() {
        if (this.props.onlineUsers && this.props.onlineUsers.length > 0) {
            console.log("this.props.onlineUsers  \n",this.props.onlineUsers);
            const onlineUsersList = this.props.onlineUsers.map(onlineUser => {
                var pic = onlineUser.profilepic || "/neo.png";
                return (
                    <div key={onlineUser.id} className="onlineUser">
                            <Link to = {`user/${onlineUser.id}`}> <img className="onlineUserPic" src={pic} /> </Link>
                        <div className="onlineUserText">
                            {onlineUser.first} {onlineUser.last}
                        </div>
                    </div>
                );
            });
            return (
                <div className="onlineUsersList">
                    <h1> Online Users </h1>
                    {onlineUsersList}
                </div>
            );
        } else {
            return (
                <div>
                    <h1> No online users </h1>
                </div>
            );
        }
    }
}

const mapStateToProps = function(state) {
    return {
        onlineUsers: state.onlineUsers
    };
};

export default connect(mapStateToProps)(OnlineUsers);
