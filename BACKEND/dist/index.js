"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jwt = require("jsonwebtoken"); //for creating and verifying tokens
const cookieParser = require("cookie-parser"); // used to parse cookies
const signup_1 = require("./controllers/signup");
const signin_1 = require("./controllers/signin");
const logout_1 = require("./controllers/logout");
const auth_middleware_1 = require("./middlewares/auth_middleware");
const me_1 = require("./controllers/me");
const addContact_1 = require("./controllers/addContact");
const sendMessage_1 = require("./controllers/sendMessage");
const contacts_1 = require("./controllers/contacts");
const messages_1 = require("./controllers/messages");
const deleteMessage_1 = require("./controllers/deleteMessage");
const socketHandler_1 = require("./socket/socketHandler");
const socketAuth_1 = require("./middlewares/socketAuth");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express_1.default.json()); //middleware to parse json
app.use(cookieParser()); //middleware to parse cookies
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true //to allow cookies to be sent along with the request
    }
});
//signup route
app.post("/signup", signup_1.signup);
//signin route
app.post("/signin", signin_1.signin);
//logout route
app.post("/logout", logout_1.logout);
///me route
app.get("/me", auth_middleware_1.authenticate, me_1.me);
//add contact/friend route
app.post("/addContact", auth_middleware_1.authenticate, addContact_1.addContact);
//Send message route:msg saved in db for past messages(done here) and emittion of msg to socket.io server for real time messaging(done below)
app.post("/sendMessage", auth_middleware_1.authenticate, sendMessage_1.sendMessage);
//get all contacts route for a user to show on left side of the chat app
app.get("/contacts", auth_middleware_1.authenticate, contacts_1.contacts);
//get messages route to get all messages between two users for a chat using query param /messages/:contact_username where contact_username is the username of the contact/receiver
app.get("/messages/:contact_username", auth_middleware_1.authenticate, messages_1.messages);
// Delete message route body from frontend will have the msgId to be deleted
app.delete("/deleteMessage", auth_middleware_1.authenticate, deleteMessage_1.deleteMessage);
//middleware for authenticating the user in socket.io 
io.use(socketAuth_1.socketAuth);
//all socket server events are handled in socketHandler function
(0, socketHandler_1.socketHandler)(io); //call the socketHandler function to handle socket events
httpServer.listen(3000, () => {
    console.log("Server running on port 3000");
});
