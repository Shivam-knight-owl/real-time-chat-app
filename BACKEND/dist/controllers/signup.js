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
exports.signup = void 0;
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); //for creating and verifying tokens
const bcrypt_1 = __importDefault(require("bcrypt")); //for hashing passwords
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, name, email, password } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); // await used: it returns a promise that is resolved with the hashed password
    //if a user with the same username already exists,return a message
    const userExists = yield db_1.prisma.user.findUnique({ where: { username: req.body.username } });
    if (userExists) {
        return res.status(400).json({ message: "User with the same username already exists", alreadyUserExists: true, alreadyEmail: true });
    }
    //if a user with same email already exists,return a message
    const emailExists = yield db_1.prisma.user.findUnique({ where: { email: req.body.email } });
    if (emailExists) {
        return res.status(400).json({ message: "User with the same email already exists", alreadyUserExists: false, alreadyEmail: true });
    }
    const user = yield db_1.prisma.user.create({
        data: {
            username,
            name,
            email,
            password: hashedPassword
        }
    });
    // generate a JWT and set it as httpOnly cookie so that it automatically gets sent with every request to the server
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || ""); // creates a token with the user.id of the user as payload
    const cookieName = process.env.COOKIE_NAME || "defaultCookieName";
    res.cookie(cookieName, token, { httpOnly: true, secure: true, sameSite: "none", path: "/", expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7) }); // set the token as a cookie
    //console.log(res);
    return res.status(200).json({ message: "User created successfully", user });
});
exports.signup = signup;
