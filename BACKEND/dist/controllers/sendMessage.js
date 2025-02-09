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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const db_1 = require("../db");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const { receiver, msg } = req.body;
        const senderId = req.body.userId; //extract the sender's userId from the request body which was added by the authenticate middleware
        // console.log("full req.body",req.body);
        // console.log("Receiver username from req.body:", receiver);
        const receiverUser = yield db_1.prisma.user.findUnique({ where: { username: receiver } }); //find the user with the given username
        if (!receiverUser) {
            return res.status(404).json({ message: "User not found" }); //if user not found return 404
        }
        //save msg in db
        const message = yield db_1.prisma.message.create({
            data: {
                text: msg,
                senderId: senderId,
                receiverId: receiverUser.id,
            }
        });
        //fetch sender details to include in response
        const senderUser = yield db_1.prisma.user.findUnique({ where: { id: senderId } });
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
});
exports.sendMessage = sendMessage;
