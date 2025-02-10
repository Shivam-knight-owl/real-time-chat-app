import { prisma } from "../db";
import bcrypt from "bcrypt";//for hashing passwords
import jwt from "jsonwebtoken";

export const signin=async (req: any, res: any) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } }); // find the user with the given username

    try {
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Invalid credentials", invalidCredentials:true });
        }
        // generate a JWT and store in cookie,set it as httpOnly cookie cookie automatically gets sent with every request to the server
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET||"") as unknown; // creates a token with the user.id of the user as payload
        res.cookie(process.env.COOKIE_NAME, token, {httpOnly: true,secure: true,sameSite:'none',path:"/",expires:new Date(Date.now() + 24*60*60*1000*7)}); // set the token as a cookie ,expiry in 7 days
        res.status(200).json({ message: "User signed in successfully", user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error signing in user",invalidCredentials:false });
    }
};