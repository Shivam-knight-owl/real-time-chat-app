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
exports.deleteMessage = void 0;
const db_1 = require("../db");
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { msgId } = req.body; //extract the msgId from the request body
        const userId = req.body.userId; //extract the userId from the request body which was added by the authenticate middleware
        const message = yield db_1.prisma.message.findUnique({ where: { id: msgId } }); //find the message with the given msgId
        if (!message) {
            return res.status(404).json({ message: "Message not found" }); //if message not found return 404
        }
        //check if the user is the sender of the message and only then allow to delete the message
        if (message.senderId !== userId) {
            return res.status(401).json({ message: "Unauthorised to delete the message" }); //if the user is not the sender of the message,return 401
        }
        //delete the message
        yield db_1.prisma.message.delete({ where: { id: msgId } });
        res.status(200).json({ message: "Message deleted successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error deleting message" });
    }
});
exports.deleteMessage = deleteMessage;
