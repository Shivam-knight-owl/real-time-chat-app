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
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//middleware for verifying the token to authenticate the user before accessing protected routes
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies[process.env.COOKIE_NAME || ""]; // extract the token from the cookie
        if (!token) {
            return res.status(401).json({ message: "Unauthorised" }); // if token is not present, return unauthenticated
        }
        //token verification
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || ""); //verify the token
            //@ts-ignore
            req.body.userId = decoded.userId; //add the userId to the request body for later usage in protected routes
            next();
        }
        catch (err) {
            console.log(err);
            return res.status(401).json({ message: "Invalid Token" });
        }
    });
}
