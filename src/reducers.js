export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_AND_WANNABES") {
        // console.log("action", action);
        state = Object.assign({}, state, {
            friends: action.friends
        });
        // console.log("state (in reducer)",state);
    }
    if (action.type == "REMOVE_FRIEND") {
        // console.log("action", action);
        state = {
            ...state,
            friends: state.friends.map(friend => {
                if (friend.id == action.id) {
                    return {
                        ...friend,
                        status: 4
                    };
                } else {
                    return friend;
                }
            })
        };
    }
    if (action.type == "ACCEPT_FRIEND") {
        // console.log("action", action);
        state = {
            ...state,
            friends: state.friends.map(friend => {
                if (friend.id == action.id) {
                    return {
                        ...friend,
                        status: 3
                    };
                } else {
                    return friend;
                }
            })
        };
    }
    if (action.type == "DENY_FRIEND") {
        // console.log("action", action);
        state = {
            ...state,
            friends: state.friends.map(friend => {
                if (friend.id == action.id) {
                    return {
                        ...friend,
                        status: 5
                    };
                } else {
                    return friend;
                }
            })
        };
    }

    if (action.type == "ONLINE_USERS") {
        // console.log("REDUCER ONLINE_USERS", action);
        //take out current user!
        state = {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

    if (action.type == "USER_JOINED") {
        console.log("REDUCER user joined:", action.newUser);

        state = {
            ...state,
            onlineUsers: [...state.onlineUsers, action.newUser]
        };
    }
    if (action.type == "USER_LEFT") {
        console.log("*********************");
        console.log("******reducer*******");
        console.log("state.onlineUsers", state.onlineUsers);
        console.log("action.userLeft", action.userId);
        // console.log("action...", action);
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(user => {
                return user.id != action.userId;
            })
        };
    }

    return state;
}
