import jwt from "jsonwebtoken";
//middleware for verifying the token to authenticate the user before accessing protected routes

export  async function authenticate(req: any, res:any, next:any) {
    const token = req.cookies[process.env.COOKIE_NAME||""]; // extract the token from the cookie
    if (!token) {
        return res.status(401).json({ message: "Unauthorised" }); // if token is not present, return unauthenticated
    }
    //token verification
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET || "");//verify the token
        //@ts-ignore
        req.body.userId=decoded.userId;//add the userId to the request body for later usage in protected routes
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({message:"Invalid Token"});
    }
}