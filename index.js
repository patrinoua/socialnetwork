const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./database/database");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const hashPassword = require("./config/hashPassword").hashPassword;
const csurf = require("csurf");

let secret;
if(!process.env.DATABASE_URL){
    secret = require('./config/secrets.json').mySecret;
}else{
    secret = process.env.MY_SECRET;
}

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080, 192.168.50.106:8080"
});

const multer = require("multer"); //it's like bodyParser but for many(multi)
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3"); //check
const config = require("./config.json");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(compression());

app.use(express.static("./public"));

// app.use(csurf());

// app.use(function(req, res, next){
//     res.cookie('mytoken', req.csrfToken());
//     next();
// });

app.use(bodyParser.json());

// I CHANGED STUFF HERE !
const cookieSessionMiddleWare = cookieSession({
    secret: secret,
    maxAge: 1000 * 60 * 60 * 24 * 14
    // maxAge: 60000 //1 minute
});
app.use(cookieSessionMiddleWare);
io.use(function(socket, next) {
    cookieSessionMiddleWare(socket.request, socket.request.res, next);
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.use(function(req, res, next) {
    console.log(`The url is ${req.url}`);
    // console.log('req.session.user :',req.session.user);
    next();
});

function requireLogin(req, res, next) {
    if (!req.session.user) {
        res.sendStatus(403);
    } else {
        next();
    }
}

app.get("/getUser", requireLogin, function(req, res) {
    res.json({
        success: true,
        user: req.session.user
    });
});

app.get("/getUser/:userId", requireLogin, function(req, res) {
    if (req.session.user.id == req.params.userId) {
        console.log(
            "req.session.user.id == req.params.userId",
            req.session.user.id == req.params.userId
        );
        console.log("req.session.user", req.session.user);
        console.log("in some wAY they should go back to /user...");
    } else {
        db
            .getUserInfoById(req.params.userId)
            .then(userInfo => {
                console.log("userInfo: for user with id...", userInfo.rows[0]);
                res.json({
                    user: userInfo.rows[0]
                });
            })
            .catch(err => {
                console.log("problem with getting userInfo", err);
            });
    }
});

app.get("/welcome", function(req, res) {
    if (!req.session.user) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/");
    }
});

app.post("/register", function(req, res) {
    console.log("user trying to register");
    console.log("req.body...", req.body);
    console.log("req.body.email...", req.body.email);
    db.checkForUser(req.body.email).then(function(result) {
        console.log("result...", result);
        if (result.rows[0]) {
            console.log("!result.rows[0]", result.rows[0]);
            req.session.email = req.body.email;
            console.log("email exists... go to login.");
            res.json({
                success: false,
                errorMsg: "User exists. go to login"
            });
        } else if (!result.rows[0]) {
            console.log("we have a new user to register!");
            if (
                req.body.first &&
                req.body.last &&
                req.body.email &&
                req.body.password
            ) {
                console.log("user managed to register");
                console.log(req.body.first, req.body.last, req.body.email);
                hashPassword(req.body.password)
                    .then(hashedPassword => {
                        db
                            .saveUser(
                                req.body.first,
                                req.body.last,
                                req.body.email,
                                hashedPassword
                            )
                            .then(result => {
                                console.log(
                                    "HAHA! user registered:",
                                    result.rows[0]
                                );
                                req.session.user = {
                                    first: req.body.first,
                                    last: req.body.last,
                                    email: req.body.email,
                                    id: result.rows[0].id,
                                    bio: result.rows[0].bio,
                                    profilePic: result.rows[0].profilepic,
                                    isLoggedIn: true
                                };

                                console.log(
                                    "new user req.session.user:",
                                    req.session.user
                                );
                                res.json({
                                    success: true
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.json({
                                    success: false
                                });
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        res.json({
                            success: false
                        });
                    });
            } else {
                console.log("please fill out everything");
                res.json({
                    success: false,
                    errorMsg: "please fill out everything"
                });
            }
        }
    });
});

app.post("/login", function(req, res) {
    console.log("req.session.user from /login post", req.session.user);
    if (req.session.user) {
        console.log("user is already logged in.");
        res.redirect("/");
    }

    if (req.body.email && req.body.password) {
        //     console.log('user gave email and password. checking if user exists:\n');
        db.getUserInfoByEmail(req.body.email).then(userInfo => {
            if (userInfo.rows[0]) {
                // console.log('userInfo after logging in:', userInfo);
                req.session.user = {
                    id: userInfo.rows[0].id,
                    first: userInfo.rows[0].first,
                    last: userInfo.rows[0].last,
                    email: userInfo.rows[0].email,
                    profilePic: userInfo.rows[0].profilepic,
                    bio: userInfo.rows[0].bio,
                    sex: userInfo.rows[0].sex,
                    isLoggedIn: true
                };
                // console.log("req.session.user in login", req.session.user);
                db
                    .checkPassword(req.body.password, userInfo.rows[0].pass)
                    .then(doesMatch => {
                        if (doesMatch) {
                            console.log("passwords match");
                            res.json({
                                success: true,
                                user: req.session.user
                            });
                        } else {
                            res.redirect(
                                "/wrongLogin?errMsg=passwords don't match"
                            );
                        }
                    })
                    .catch(err => {
                        console.log("error when checking passwords", err);
                    });
            } else {
                res.redirect("/wrongLogin?errMsg=user not found");
            }
        });
    } else {
        res.redirect("/wrongLogin?errMsg=user must fill out everything");
    }
});

app.get("/wrongLogin", function(req, res) {
    res.json({
        success: false,
        errorMsg: req.query.errMsg
    });
});
app.post("/wrongLogin", function(req, res) {
    console.log("inside wrong login post:");
});
app.post("/editBio", function(req, res) {
    console.log("updating biooo!");
    console.log("req.body.bio", req.body.bio);
    console.log("req.session.user", req.session.user);
    console.log(
        "req.session.user.id, req.session.user.id",
        req.session.user.id,
        req.session.user.id
    );
    let id = req.session.user.id || req.session.user.id;
    console.log("req.session.user.id", id);
    if (req.body.bio) {
        db
            .updateBio(req.body.bio, id)
            .then(updatedBio => {
                console.log("managed to update bio...", updatedBio.rows[0]);
                req.session.user.bio = updatedBio.rows[0].bio;
                res.json({
                    success: true,
                    bio: updatedBio.rows[0].bio
                });
            })
            .catch(err => {
                console.log("problem when updating bio", err);
            });
    }
});

app.post("/updateProfilePic", uploader.single("file"), s3.upload, function(
    req,
    res
) {
    console.log("req.session", req.session.user.email);
    console.log("config.s3Url", config.s3Url);
    console.log("req.file.filename", req.file.filename);
    if (req.file) {
        const imageUrl = config.s3Url + req.file.filename;
        console.log("jksdhakjdhakjdhajksdhaksjdhkaj");

        db
            .updateProfilePic(imageUrl, req.session.user.email)
            .then(result => {
                console.log("added to db: ", result.rows[0]);
                req.session.user.profilePic = imageUrl;
                res.json({
                    imageUrl: imageUrl,
                    images: result.rows[0],
                    success: true
                });
            })
            .catch(err => {
                console.log("problem with adding to db: ", err);
            });
    } else {
        console.log("boo...");
    }
});

app.get("/checkFriendshipStatus", function(req, res) {
    // console.log(" /checkFriendshipStatus' : req.session.user.id, req.session.user.id",req.session.user.user_id, req.session.user.id);
    db
        .checkFriendshipStatus(req.session.user.id, req.query.otherId)
        .then(status => {
            // status.rows[0] ? console.log("the status is... ",status.rows[0].status) : console.log("the status is... ",status.rows[0]) ;
            if (!status.rows[0]) {
                res.json({});
            } else {
                res.json({
                    friendshipStatus: status.rows[0]
                });
            }
        });
});

app.post("/updateFriendshipStatus", function(req, res) {
    db
        .updateFriendshipStatus(
            req.session.user.id,
            req.body.id,
            req.body.status
        )
        .then(status => {
            if (!status.rows[0] && req.body.status == 1) {
                db
                    .sendFriendRequest(
                        req.session.user.id,
                        req.body.id,
                        req.body.status
                    )
                    .then(status => {
                        res.json({
                            friendshipStatus: status.rows[0]
                        });
                    });
            } else {
                res.json({
                    friendshipStatus: status.rows[0]
                });
            }
        });
});

app.get("/getFriendsAndWannabes", function(req, res) {
    db
        .getFriendsAndWannabes(req.session.user.id)
        .then(status => {
            if (!status.rows) {
                res.json({});
            } else {
                res.json({
                    friends: status.rows
                });
            }
        })
        .catch(err => {
            console.log("err when getting friends", err);
        });
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function(req, res) {
    if (req.url == "/welcome" && req.session.user) {
        res.redirect("/");
        return;
    }
    if (!req.session.user) {
        res.redirect("/welcome");
        return;
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/", function(req, res) {
    // just a normal route
    res.sendStatus(200);
});

server.listen(8080);

let onlineUsers = [];

io.on("connection", function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    const session = socket.request.session;

    if (!session.user) {
        socket.disconnect(true);
        return;
    }

    onlineUsers.push({
        socketId: socket.id,
        userId: session.user.id
    });

    let onlineUsersIdAll = onlineUsers.map(onlineUser => onlineUser.userId);

    db.getUsersByIds(onlineUsersIdAll).then(users => {
        // console.log("emiting online users", users.rows);
        socket.emit("onlineUsers", users.rows);
    });

    if (
        onlineUsers.filter(user => {
            return user.userId == session.user.id;
        }).length == 1
    ) {
        let userThatJoined = {
            id: session.user.id,
            first: session.user.first,
            last: session.user.last,
            profilepic: session.user.profilepic
        };
        socket.broadcast.emit("userJoined", userThatJoined);
    }

    socket.on("disconnect", function() {
        console.log(`socket with the id ${socket.id} is now disconnected`);

        onlineUsers = onlineUsers.filter(user => {
            return user.socketId !== socket.id;
        });

        if (!onlineUsers.find(user => user.userId == session.user.id)) {
            const { id } = session.user;
            io.sockets.emit("userLeft", { id });
        }
    });
    socket.on("thanks", function(data) {
        console.log(data);
    });

    socket.emit("welcome", {
        message: "Welome. It is nice to see you"
    });
});

//not sure if this is in use:
// app.get('/getFriendById', requireLogin, function(req,res){
//     console.log("req.params.id",req.query.id);
//     db.getFriendById(req.query.id)
//     .then(friend=>{
//         console.log('found friend:', friend.rows);
//         res.json({
//             friend: friend.rows[0]
//         })
//     })
//     .catch(err=>{
//         console.log('err when getting friend', err);
//     })
// })
