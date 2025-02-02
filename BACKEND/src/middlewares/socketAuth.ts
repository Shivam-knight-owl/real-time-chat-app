import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export function socketAuth(socket:Socket,next:any){
    const cookies = cookie.parse(socket.handshake.headers.cookie || ""); // parse the cookies from the handshake headers
    const token = cookies[process.env.COOKIE_NAME||""];//extract the token from the cookies
    if (!token) {
        return next(new Error("Authentication error"));//if no token found,return an error
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET || "");//verify the token
    //@ts-ignore
    const userId=decoded.userId;//extract the userId from the decoded token
    socket.data.user=userId;//add the userId to the socket object
    next();//if token found,call the next middleware
}