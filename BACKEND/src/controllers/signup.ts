import { prisma } from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";//for creating and verifying tokens
import bcrypt from "bcrypt";//for hashing passwords

export const  signup=async ( req: any,res:any) => {
    const { username, name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // await used: it returns a promise that is resolved with the hashed password

    //if a user with the same username already exists,return a message
    const userExists=await prisma.user.findUnique({where:{username:req.body.username}});
    if(userExists){
        return res.status(400).json({message:"User with the same username already exists",alreadyUserExists:true,alreadyEmail:true});
    }
    //if a user with same email already exists,return a message
    const emailExists=await prisma.user.findUnique({where:{email:req.body.email}});
    if(emailExists){
        return res.status(400).json({message:"User with the same email already exists",alreadyUserExists:false,alreadyEmail:true});
    }
    const user = await prisma.user.create({
        data: {
            username,
            name,
            email,
            password: hashedPassword
        }
    });
    // generate a JWT and set it as httpOnly cookie so that it automatically gets sent with every request to the server
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET||"") as unknown; // creates a token with the user.id of the user as payload
    
    const cookieName = process.env.COOKIE_NAME || "defaultCookieName";
    res.cookie(cookieName, token, { httpOnly: true, secure: false, sameSite: 'strict',path:"/",expires:new Date(Date.now() + 24*60*60*1000*7) }); // set the token as a cookie
    //console.log(res);
    return res.status(200).json({ message: "User created successfully", user });
}