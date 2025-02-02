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
exports.contacts = void 0;
const db_1 = require("../db");
const contacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId; //extract the userId from the request body which was added by the authenticate middleware
        const user = yield db_1.prisma.user.findUnique({ where: { id: userId } }); //find the user with the given userId
        const contacts = yield db_1.prisma.user.findUnique({ where: { id: userId } }).contacts(); //find all contacts of the user
        res.status(200).json({ "contacts": contacts === null || contacts === void 0 ? void 0 : contacts.map((contact) => { return { contactuserId: contact.id, contactName: contact.username }; }) }); //we return the contacts as an array of objects with contactuserId and contactName
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching contacts" });
    }
});
exports.contacts = contacts;
