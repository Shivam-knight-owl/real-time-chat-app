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
exports.addContact = void 0;
const db_1 = require("../db");
const addContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contact_username } = req.body; // extract the contact username i.e B from the request body
        const userId = req.body.userId; // extract the userId of A from the request body which was added by the authenticate middleware
        //console.log(`Adding contact: ${contact_username} for user with userId: ${userId}`);
        const contact = yield db_1.prisma.user.findUnique({ where: { username: contact_username } }); // find the user with the given username B
        if (!contact) {
            return res.status(404).json({ message: "User not found", found: false }); // if user not found return 404
        }
        // Check if contact is already added in contact list of A
        const user = yield db_1.prisma.user.findUnique({
            where: { id: userId },
            include: { contacts: true }
        });
        if (user === null || user === void 0 ? void 0 : user.contacts.find((c) => c.id === contact.id)) {
            return res.status(400).json({ message: "Contact already added", contacts: { "contactuserId": contact.id, "contactName": contact.username }, found: true });
        }
        // update A and add B to the contacts list of A
        yield db_1.prisma.user.update({
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
        const contactUser = yield db_1.prisma.user.update({
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
});
exports.addContact = addContact;
