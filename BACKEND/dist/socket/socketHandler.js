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
exports.socketHandler = socketHandler;
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); //for creating and verifying tokens   
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cookie_1 = __importDefault(require("cookie"));
//creating userMap to store active users
const userMap = new Map(); // to store active users
function socketHandler(io) {
    io.on("connection", (socket) => {
        try {
            const cookies = cookie_1.default.parse(socket.handshake.headers.cookie || ""); // parse the cookies from the handshake headers
            const token = cookies[process.env.COOKIE_NAME || ""]; //extract the token from the cookies
            if (!token) {
                console.log("No token found,Disconnecting...");
                socket.disconnect(); //disconnect the user if no token is found
                return;
            }
            //verfiy the token to authenticate the user we cant use authenticate middleware here as it is not a route and as in socket.io we dont have req,res objects to pass to the middleware function,instead has socket object
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || ""); //verify the token
            const userId = decoded.userId; //extract the userId from the decoded token
            //Add the user to the userMap which stores the active users
            userMap.set(userId, socket.id);
            //real time active/online users event: by emitting userMap to all clients(little bad method tho)
            let activeUsers = Array.from(userMap.keys()).map(userId => ({
                contactuserId: userId,
            }));
            // console.log("Active Users from usermap", activeUsers);
            // setTimeout(()=>{
            //     io.emit("activeUsers", {activeUsers});//we use setTimeout to emit the activeUsers event after 100ms to ensure that the user is added to the userMap before emitting the activeUsers event 
            // },1000); // Emit active users to all clients
            //console.log("active usersMap",userMap);
            //to handle disconnection
            socket.on("disconnect", () => {
                // console.log("User disconnected");
                userMap.delete(socket.data.user); //remove the user from the userMap on disconnection
                //console.log("active usersMap after disconnections:",userMap);
                activeUsers = activeUsers.filter((user) => user.contactuserId !== socket.data.user); //filter out the disconnected user from the activeUsers array
                io.emit("activeUsers", { activeUsers }); // Emit active users to all clients
            });
            socket.on("getActiveUsers", () => {
                io.emit("activeUsers", { activeUsers }); // Emit active users to all clients
            });
            //real time messaging
            socket.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
                // console.log(data,socket.data);
                // console.log(userMap);
                const { receiver, msg, msgId, sender } = data;
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
            socket.on("deleteMessage", (data) => __awaiter(this, void 0, void 0, function* () {
                //console.log(data);
                const { msgId } = data;
                //finding the receiverId of the message to send the delete message event to the receiver in one db call
                const message = yield db_1.prisma.message.findUnique({
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
            socket.on("addedContact", (data) => __awaiter(this, void 0, void 0, function* () {
                //console.log(data);
                const { contact } = data;
                //we want both id and name of sender user who added the contact to be sent to the receiver/contact
                //for that we want both id and username of the sender user i.e the current user who added the contact
                const senderId = socket.data.user; //extract the sender's userId from the socket object
                const senderUser = yield db_1.prisma.user.findUnique({ where: { id: senderId } }); //find the user with the given userId
                io.to(userMap.get(contact.contactuserId) || "").emit("addedContact", { sender: { contactUserId: senderId, contactName: senderUser === null || senderUser === void 0 ? void 0 : senderUser.username } }); //emit the addedContact event to the receiver contact
            }));
        }
        catch (err) {
            // console.log("Invalid token,Disconnecting...");
            // socket.disconnect();//if any error occurs,disconnect the user
            console.log(err);
        }
    });
}
