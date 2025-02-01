"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const cookie_1 = __importDefault(require("cookie")); // used to parse cookies from socket handshake headers
const bcrypt_1 = __importDefault(require("bcrypt")); //for hashing passwords
const client_1 = require("@prisma/client"); //for interacting with the database via prisma
const prisma = new client_1.PrismaClient();
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
const JWT_SECRET = "secret"; //secret key for jwt
const COOKIE_NAME = "auth_token"; //name of the cookie that will store the token
//middleware for verifying the token to authenticate the user before accessing protected routes
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies[COOKIE_NAME]; // extract the token from the cookie
        if (!token) {
            return res.status(401).json({ message: "Unauthorised" }); // if token is not present, return unauthenticated
        }
        //token verification
        try {
            const decoded = jwt.verify(token, JWT_SECRET); //verify the token
            req.body.userId = decoded.userId; //add the userId to the request body for later usage in protected routes
            next();
        }
        catch (err) {
            console.log(err);
            return res.status(401).json({ message: "Invalid Token" });
        }
    });
}
//signup route
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, name, email, password } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); // await used: it returns a promise that is resolved with the hashed password
    //if a user with the same username already exists,return a message
    const userExists = yield prisma.user.findUnique({ where: { username: req.body.username } });
    if (userExists) {
        return res.status(400).json({ message: "User with the same username already exists", alreadyUserExists: true, alreadyEmail: true });
    }
    //if a user with same email already exists,return a message
    const emailExists = yield prisma.user.findUnique({ where: { email: req.body.email } });
    if (emailExists) {
        return res.status(400).json({ message: "User with the same email already exists", alreadyUserExists: false, alreadyEmail: true });
    }
    const user = yield prisma.user.create({
        data: {
            username,
            name,
            email,
            password: hashedPassword
        }
    });
    // generate a JWT and set it as httpOnly cookie so that it automatically gets sent with every request to the server
    const token = jwt.sign({ userId: user.id }, JWT_SECRET); // creates a token with the user.id of the user as payload
    res.cookie(COOKIE_NAME, token, { httpOnly: true, secure: false, sameSite: 'strict', path: "/", expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7) }); // set the token as a cookie
    //console.log(res);
    res.status(200).json({ message: "User created successfully", user });
}));
//signin route
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.user.findUnique({ where: { username } }); // find the user with the given username
    try {
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials", invalidCredentials: true });
        }
        // generate a JWT and store in cookie,set it as httpOnly cookie cookie automatically gets sent with every request to the server
        const token = jwt.sign({ userId: user.id }, JWT_SECRET); // creates a token with the user.id of the user as payload
        res.cookie(COOKIE_NAME, token, { httpOnly: true, secure: false, sameSite: 'strict', path: "/", expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7) }); // set the token as a cookie ,expiry in 7 days
        res.status(200).json({ message: "User signed in successfully", user });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error signing in user", invalidCredentials: false });
    }
}));
//logout route
app.post("/logout", (req, res) => {
    //if the user is already logged out,return a message
    if (!req.cookies[COOKIE_NAME]) {
        return res.status(200).json([{ message: "User already logged out" }, { alreadyLoggedOut: true }]);
    }
    res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: false, sameSite: "strict" }); //clear the cookie so that the user is logged out
    res.status(200).json([{ message: "User logged out successfully" }, { alreadyLoggedOut: false }]);
});
///me route
app.get("/me", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId; //extract the userId from the request body which was added by the authenticate middleware
        const user = yield prisma.user.findUnique({ where: { id: userId } }); //find the user with the given userId
        res.status(200).json({ user });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching user" });
    }
}));
//add contact/friend route
app.post("/addContact", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contact_username } = req.body; // extract the contact username i.e B from the request body
        const userId = req.body.userId; // extract the userId of A from the request body which was added by the authenticate middleware
        console.log(`Adding contact: ${contact_username} for user with userId: ${userId}`);
        const contact = yield prisma.user.findUnique({ where: { username: contact_username } }); // find the user with the given username B
        if (!contact) {
            return res.status(404).json({ message: "User not found", found: false }); // if user not found return 404
        }
        // Check if contact is already added in contact list of A
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: { contacts: true }
        });
        if (user === null || user === void 0 ? void 0 : user.contacts.find((c) => c.id === contact.id)) {
            return res.status(400).json({ message: "Contact already added", contacts: { "contactuserId": contact.id, "contactName": contact.username }, found: true });
        }
        // update A and add B to the contacts list of A
        yield prisma.user.update({
            where: { id: userId },
            data: {
                contacts: {
                    connect: {
                        id: contact.id // add B to the contacts list of A
                    }
                }
            }
        });
        // update B and add A to the contacts list of B
        const contactUser = yield prisma.user.update({
            where: { id: contact.id },
            data: {
                contacts: {
                    connect: {
                        id: userId // add A to the contacts list of B
                    }
                }
            }
        });
        res.status(200).json({ message: "Contact added successfully", contacts: { "contactuserId": contactUser.id, "contactName": contactUser.username }, found: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error adding contact" });
    }
}));
//Send message route:msg saved in db for past messages(done here) and emittion of msg to socket.io server for real time messaging(done below)
app.post("/sendMessage", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const { receiver, msg } = req.body;
        const senderId = req.body.userId; //extract the sender's userId from the request body which was added by the authenticate middleware
        console.log("full req.body", req.body);
        console.log("Receiver username from req.body:", receiver);
        const receiverUser = yield prisma.user.findUnique({ where: { username: receiver } }); //find the user with the given username
        if (!receiverUser) {
            return res.status(404).json({ message: "User not found" }); //if user not found return 404
        }
        //save msg in db
        const message = yield prisma.message.create({
            data: {
                text: msg,
                senderId: senderId,
                receiverId: receiverUser.id,
            }
        });
        //fetch sender details to include in response
        const senderUser = yield prisma.user.findUnique({ where: { id: senderId } });
        //detailed message object to be sent to the client in response
        const messageDetails = {
            messageId: message.id,
            text: message.text,
            sender: {
                id: senderUser === null || senderUser === void 0 ? void 0 : senderUser.id,
                username: senderUser === null || senderUser === void 0 ? void 0 : senderUser.username
            },
            receiver: {
                id: receiverUser.id,
                username: receiverUser.username
            },
            timestamp: message.createdAt,
        };
        res.status(200).json({ message: "Message sent successfully", data: messageDetails });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error sending message" });
    }
}));
//get all contacts route for a user to show on left side of the chat app
app.get("/contacts", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId; //extract the userId from the request body which was added by the authenticate middleware
        const user = yield prisma.user.findUnique({ where: { id: userId } }); //find the user with the given userId
        const contacts = yield prisma.user.findUnique({ where: { id: userId } }).contacts(); //find all contacts of the user
        res.status(200).json({ "contacts": contacts === null || contacts === void 0 ? void 0 : contacts.map((contact) => { return { contactuserId: contact.id, contactName: contact.username }; }) }); //we return the contacts as an array of objects with contactuserId and contactName
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching contacts" });
    }
}));
//get messages route to get all messages between two users for a chat using query param /messages/:contact_username where contact_username is the username of the contact/receiver
app.get("/messages/:contact_username", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contact_username } = req.params; //extract the contact username from the request params
        const userId = req.body.userId; //extract the userId from the request body which was added by the authenticate middleware
        const contact = yield prisma.user.findUnique({ where: { username: contact_username } }); //find the user with the given username
        if (!contact) {
            return res.status(404).json({ message: "User not found" }); //if user not found return 404
        }
        //find all messages between the two users
        const messages = yield prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        receiverId: contact.id
                    },
                    {
                        senderId: contact.id,
                        receiverId: userId
                    }
                ]
            }
        });
        //we want details of message to be sent to the client in response
        res.status(200).json({ messages: messages.map((msg) => {
                return {
                    messageId: msg.id,
                    text: msg.text,
                    sender: {
                        id: msg.senderId,
                        username: msg.senderId === userId ? "You" : contact_username
                    },
                    receiver: {
                        id: msg.receiverId,
                        username: msg.receiverId === userId ? "You" : contact_username
                    },
                    timestamp: msg.createdAt
                }; // we send a single object with messages as key and value as array of objects which have messageId,text,sender,receiver,timestamp
            }) });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching messages..." });
    }
}));
// Delete message route body from frontend will have the msgId to be deleted
app.delete("/deleteMessage", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { msgId } = req.body; //extract the msgId from the request body
        const userId = req.body.userId; //extract the userId from the request body which was added by the authenticate middleware
        const message = yield prisma.message.findUnique({ where: { id: msgId } }); //find the message with the given msgId
        if (!message) {
            return res.status(404).json({ message: "Message not found" }); //if message not found return 404
        }
        //check if the user is the sender of the message and only then allow to delete the message
        if (message.senderId !== userId) {
            return res.status(401).json({ message: "Unauthorised to delete the message" }); //if the user is not the sender of the message,return 401
        }
        //delete the message
        yield prisma.message.delete({ where: { id: msgId } });
        res.status(200).json({ message: "Message deleted successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error deleting message" });
    }
}));
//creating userMap to store active users
const userMap = new Map(); // to store active users
//middleware for authenticating the user in socket.io 
io.use((socket, next) => {
    const cookies = cookie_1.default.parse(socket.handshake.headers.cookie || ""); // parse the cookies from the handshake headers
    const token = cookies[COOKIE_NAME]; //extract the token from the cookies
    if (!token) {
        return next(new Error("Authentication error")); //if no token found,return an error
    }
    const decoded = jwt.verify(token, JWT_SECRET); //verify the token
    const userId = decoded.userId; //extract the userId from the decoded token
    socket.data.user = userId; //add the userId to the socket object
    next(); //if token found,call the next middleware
});
io.on("connection", (socket) => {
    try {
        const cookies = cookie_1.default.parse(socket.handshake.headers.cookie || ""); // parse the cookies from the handshake headers
        const token = cookies[COOKIE_NAME]; //extract the token from the cookies
        if (!token) {
            console.log("No token found,Disconnecting...");
            socket.disconnect(); //disconnect the user if no token is found
            return;
        }
        //verfiy the token to authenticate the user we cant use authenticate middleware here as it is not a route and as in socket.io we dont have req,res objects to pass to the middleware function,instead has socket object
        const decoded = jwt.verify(token, JWT_SECRET); //verify the token
        const userId = decoded.userId; //extract the userId from the decoded token
        //Add the user to the userMap which stores the active users
        userMap.set(userId, socket.id);
        //real time active/online users event: by emitting userMap to all clients(little bad method tho)
        let activeUsers = Array.from(userMap.keys()).map(userId => ({
            contactuserId: userId,
        }));
        // console.log("Active Users from usermap", activeUsers);
        setTimeout(() => {
            io.emit("activeUsers", { activeUsers });
        }, 1000); // Emit active users to all clients
        console.log("active usersMap", userMap);
        //to handle disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected");
            userMap.delete(socket.data.user); //remove the user from the userMap on disconnection
            console.log("active usersMap after disconnections:", userMap);
            activeUsers = activeUsers.filter((user) => user.contactuserId !== socket.data.user); //filter out the disconnected user from the activeUsers array
            io.emit("activeUsers", { activeUsers }); // Emit active users to all clients
        });
        //real time messaging
        socket.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(data, socket.data);
            console.log(userMap);
            const { receiver, msg, msgId, sender } = data;
            // const receiverUser=await prisma.user.findUnique({where:{username:receiver}});//find the user with the given username
            // if(!receiverUser){
            //     return;//if user not found return
            // }
            // const senderId=socket.data.user;//extract the sender's userId from the socket object
            // const senderUser=await prisma.user.findUnique({where:{id:senderId}});//find the user with the given userId
            // Prepare the message details to be sent
            const messageDetailsForSender = {
                messageId: msgId,
                text: msg,
                sender: {
                    id: sender === null || sender === void 0 ? void 0 : sender.id,
                    username: "You", // Sender sees "You" for themselves
                },
                receiver: {
                    id: receiver === null || receiver === void 0 ? void 0 : receiver.id,
                    username: receiver === null || receiver === void 0 ? void 0 : receiver.username, // Receiver's actual username
                },
                timestamp: new Date(),
            };
            const messageDetailsForReceiver = {
                messageId: msgId,
                text: msg,
                sender: {
                    id: sender === null || sender === void 0 ? void 0 : sender.id,
                    username: sender === null || sender === void 0 ? void 0 : sender.username, // Sender's actual username
                },
                receiver: {
                    id: receiver === null || receiver === void 0 ? void 0 : receiver.id,
                    username: "You", // Receiver sees "You" for themselves
                },
                timestamp: new Date(),
            };
            // Emit the message details
            io.to(userMap.get(receiver.id) || "").emit("message", messageDetailsForReceiver); // Send to the receiver
            io.to(userMap.get(sender.id) || "").emit("message", messageDetailsForSender); // Send to the sender
        }));
        //real time message deletion
        socket.on("deleteMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(data);
            const { msgId } = data;
            //finding the receiverId of the message to send the delete message event to the receiver in one db call
            const message = yield prisma.message.findUnique({
                where: { id: msgId },
                select: {
                    receiverId: true
                }
            });
            if (message) {
                io.to(userMap.get(message.receiverId) || "").emit("deleteMessage", msgId); // emit the delete message event to the receiver
            }
        }));
        //real time add contact event
        socket.on("addedContact", (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(data);
            const { contact } = data;
            //we want both id and name of sender user who added the contact to be sent to the receiver/contact
            //for that we want both id and username of the sender user i.e the current user who added the contact
            const senderId = socket.data.user; //extract the sender's userId from the socket object
            const senderUser = yield prisma.user.findUnique({ where: { id: senderId } }); //find the user with the given userId
            io.to(userMap.get(contact.contactuserId) || "").emit("addedContact", { sender: { contactUserId: senderId, contactName: senderUser === null || senderUser === void 0 ? void 0 : senderUser.username } }); //emit the addedContact event to the receiver contact
            // Emit the activeUsers event to the newly added contact
            const activeUsers = Array.from(userMap.keys()).map(userId => ({
                contactuserId: userId,
            }));
            io.to(userMap.get(contact.contactuserId) || "").emit("activeUsers", { activeUsers });
        }));
    }
    catch (err) {
        // console.log("Invalid token,Disconnecting...");
        // socket.disconnect();//if any error occurs,disconnect the user
        console.log(err);
    }
});
httpServer.listen(3000, () => {
    console.log("Server running on port 3000");
});
