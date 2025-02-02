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
exports.messages = void 0;
const db_1 = require("../db");
const messages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contact_username } = req.params; //extract the contact username from the request params
        const userId = req.body.userId; //extract the userId from the request body which was added by the authenticate middleware
        const contact = yield db_1.prisma.user.findUnique({ where: { username: contact_username } }); //find the user with the given username
        if (!contact) {
            return res.status(404).json({ message: "User not found" }); //if user not found return 404
        }
        //find all messages between the two users
        const messages = yield db_1.prisma.message.findMany({
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
});
exports.messages = messages;
