import {io} from "socket.io-client";
// import dotenv from "dotenv";
// dotenv.config()
console.log(import.meta.env.VITE_BACKEND_URL);
export const socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
    // transports: ["websocket"], 
});