"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuth = socketAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
function socketAuth(socket, next) {
    const cookies = cookie_1.default.parse(socket.handshake.headers.cookie || ""); // parse the cookies from the handshake headers
    const token = cookies[process.env.COOKIE_NAME || ""]; //extract the token from the cookies
    if (!token) {
        return next(new Error("Authentication error")); //if no token found,return an error
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || ""); //verify the token
    const userId = decoded.userId; //extract the userId from the decoded token
    socket.data.user = userId; //add the userId to the socket object
    next(); //if token found,call the next middleware
}
