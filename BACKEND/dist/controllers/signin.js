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
exports.signin = void 0;
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt")); //for hashing passwords
const jwt = require("jsonwebtoken");
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.prisma.user.findUnique({ where: { username } }); // find the user with the given username
    try {
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials", invalidCredentials: true });
        }
        // generate a JWT and store in cookie,set it as httpOnly cookie cookie automatically gets sent with every request to the server
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET); // creates a token with the user.id of the user as payload
        res.cookie(process.env.COOKIE_NAME, token, { httpOnly: true, secure: false, sameSite: 'strict', path: "/", expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7) }); // set the token as a cookie ,expiry in 7 days
        res.status(200).json({ message: "User signed in successfully", user });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error signing in user", invalidCredentials: false });
    }
});
exports.signin = signin;
