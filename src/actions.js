import axios from "axios";

export async function receiveFriends() {
    const { data } = await axios.get("/getFriendsAndWannabes");
    // console.log('in Actions. logging friends and wannabes!', data);
    return {
        type: "RECEIVE_FRIENDS_AND_WANNABES",
        friends: data.friends
    };
}

export async function removeFriend(id) {
    const { data } = await axios.post("updateFriendshipStatus", {
        id: id,
        status: 4
    });
    return {
        type: "REMOVE_FRIEND",
        id: id
    };
}

export async function acceptFriend(id) {
    const { data } = await axios.post("updateFriendshipStatus", {
        id: id,
        status: 3
    });
    return {
        type: "ACCEPT_FRIEND",
        id: id
    };
}
export async function denyFriend(id) {
    // console.log('the id of the person...');
    const { data } = await axios.post("updateFriendshipStatus", {
        id: id,
        status: 5
    });
    // console.log('(inside denyFriend actions)data after accepting a friend', data);
    return {
        type: "DENY_FRIEND",
        id: id
    };
}

export async function onlineUsers(array) {
    console.log("ACTION: onlineUsers", array);
    return {
        type: "ONLINE_USERS",
        onlineUsers: array
    };
    //only send back ones that are not the current user
}
export async function userJoined(user) {
    console.log("ACTION: user Joined", user);
    return {
        type: "USER_JOINED",
        newUser: user
    };
}

export async function userLeft(user) {
    console.log("ACTION: userLeft", user.id);
    return {
        type: "USER_LEFT",
        userId: user.id
    };
}
