import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
    receiveFriends,
    removeFriend,
    acceptFriend,
    denyFriend
} from "./actions";

class Friends extends React.Component {
    componentDidMount() {
        this.props.dispatch(receiveFriends());
    }

    friendFormat(friend, type) {
        var pic = friend.profilepic || "neo.png";
        if (type == "exists") {
            return (
                <div key={friend.id} className="friendBox">

                        <img
                            src="x.png"
                            className="icons removeFriendIcon"
                            onClick={() => {
                                this.props.dispatch(removeFriend(friend.id));
                            }}
                        />

                    <Link to={`user/${friend.id}`} className="friendBoxPic" >
                        <img src={pic} />
                    </Link>
                    <div className="existingFriendBoxText">
                        {friend.first} {friend.last}
                    </div>
                </div>
            );
        } else {
            return (
                <div key={friend.id} className="pendingPerson">
                    <Link to={`user/${friend.id}`}>
                        <img className="pendingPic" src={pic} />
                    </Link>
                    <div className="pendingName">
                        {friend.first} {friend.last}
                    </div>
                    {/*<div className="inARow">*/}
                    <div className="pendingAccept">
                        Accept{" "}
                        <img
                            src="tick.png"
                            className="icons"
                            onClick={() => {
                                this.props.dispatch(acceptFriend(friend.id));
                            }}
                        />
                        Deny{" "}
                        <img
                            src="x.png"
                            className="icons"
                            onClick={() => {
                                this.props.dispatch(denyFriend(friend.id));
                            }}
                        />
                    </div>
                </div>
            );

            // return (
            //     <div key={friend.id} className="pendingPerson">
            //         <h1> pending! </h1>
            //
            //         <div className="pendingPic">
            //             <img src={friend.profilepic}/>
            //         </div>
            //         <div className="pendingName">
            //         {friend.first} {friend.last}
            //         </div>
            //         {/*<div className="inARow">*/}
            //             <div className="pendingAccept">
            //                 <div className="inARow">
            //                     Accept <img src='tick.png' className='icons' onClick={()=>{this.props.dispatch(acceptFriend(friend.id))}}/>
            //                     Deny <img src='x.png' className='icons' onClick={()=>{this.props.dispatch(denyFriend(friend.id))}}/>
            //                 </div>
            //             </div>
            //         {/*</div>*/}
            //     </div>)

            // return (
            //     <div key={friend.id} className="friendBox">
            //         <div className="friendBoxPic">
            //             {/*<img src='x.jpg' className='xButton' onClick={()=>{this.props.dispatch(removeFriend(friend.id))}}/>*/}
            //             <img src={friend.profilepic}/>
            //         </div>
            //         <div className="pendingFriendBoxText">
            //             lalala {friend.first} {friend.last}
            //         </div>
            //         <div className="inARow">
            //             <img src='tick.png' className='icons' onClick={()=>{this.props.dispatch(acceptFriend(friend.id))}}/>
            //             <img src='x.png' className='icons' onClick={()=>{this.props.dispatch(denyFriend(friend.id))}}/>
            //         </div>
            //     </div>
            // )
        }
    }
    render() {
        const { friends } = this.props;
        if (!friends) {
            return null;
        }
        const existingFriends = this.props.existingFriends.map(existing => {
            return this.friendFormat(existing, "exists");
        });

        const pendingFriends = this.props.pendingFriends.map(pending => {
            return this.friendFormat(pending, "pending");
        });

        // console.log('exist, pending...', pendingFriends, existingFriends);
        return (
            <div className="friendsComponent">
                <div className="pendingFriends">
                    <h1> Pending Friends </h1>
                    <div className="pendingFriendsList">{pendingFriends}</div>
                </div>

                <div className="existingFriends">
                    <h1> Friends </h1>
                    <div className="existingList">{existingFriends}</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    // console.log('state!!!',state.friends);
    return {
        friends: state.friends && state.friends.filter(friends => friends),
        existingFriends:
            state.friends &&
            state.friends.filter(friends => friends.status == 3),
        pendingFriends:
            state.friends &&
            state.friends.filter(friends => friends.status == 1)
    };
};

export default connect(mapStateToProps)(Friends);
