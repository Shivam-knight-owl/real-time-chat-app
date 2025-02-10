
export const logout=(req:any, res:any) => {
    //if the user is already logged out,return a message
    if(!req.cookies[process.env.COOKIE_NAME||""]){
        return res.status(200).json([{message:"User already logged out"},{alreadyLoggedOut:true}]);
    }
    res.clearCookie(process.env.COOKIE_NAME || "", {httpOnly:true,  secure:true, sameSite:"none"});//clear the cookie so that the user is logged out
    res.status(200).json([{message:"User logged out successfully"},{alreadyLoggedOut:false}]);
}