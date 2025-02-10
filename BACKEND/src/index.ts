//import { Socket } from "socket.io";
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
//const jwt=require("jsonwebtoken");//for creating and verifying tokens
import cookieParser from "cookie-parser"; // used to parse cookies
// import cookie from "cookie"; // used to parse cookies from socket handshake headers
// import bcrypt from "bcrypt";//for hashing passwords
// import {prisma} from "./db";
import { signup } from "./controllers/signup";
import { signin } from "./controllers/signin";
import { logout } from "./controllers/logout";
import { authenticate } from "./middlewares/auth_middleware";
import { me } from "./controllers/me";
import { addContact } from "./controllers/addContact";
import { sendMessage } from "./controllers/sendMessage";
import { contacts } from "./controllers/contacts";
import { messages } from "./controllers/messages";
import { deleteMessage } from "./controllers/deleteMessage";
import { socketHandler } from "./socket/socketHandler";
import { socketAuth } from "./middlewares/socketAuth";

const app=express();
const httpServer = createServer(app);

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));

app.use(express.json());//middleware to parse json
app.use(cookieParser());//middleware to parse cookies

const io = new Server(httpServer, {
    cors: {
        origin:["http://localhost:5173","https://183xwbgq-5173.inc1.devtunnels.ms"],
        methods: ["GET", "POST","PUT","DELETE"],
        credentials: true//to allow cookies to be sent along with the request
    }
});

//signup route
app.post("/signup",signup );

//signin route
app.post("/signin", signin);

//logout route
app.post("/logout", logout);

///me route
app.get("/me",authenticate,me);

//add contact/friend route
app.post("/addContact", authenticate,addContact);

//Send message route:msg saved in db for past messages(done here) and emittion of msg to socket.io server for real time messaging(done below)
app.post("/sendMessage",authenticate,sendMessage);

//get all contacts route for a user to show on left side of the chat app
app.get("/contacts",authenticate,contacts);

//get messages route to get all messages between two users for a chat using query param /messages/:contact_username where contact_username is the username of the contact/receiver
app.get("/messages/:contact_username",authenticate,messages);

// Delete message route body from frontend will have the msgId to be deleted
app.delete("/deleteMessage",authenticate,deleteMessage);

//middleware for authenticating the user in socket.io 
io.use(socketAuth);

//all socket server events are handled in socketHandler function
socketHandler(io);//call the socketHandler function to handle socket events

httpServer.listen(3000,()=>{
    console.log("Server running on port 3000");
})