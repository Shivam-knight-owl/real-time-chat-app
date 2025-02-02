import { prisma } from "../db";

export const deleteMessage=async(req:any,res:any)=>{
    try{
        const {msgId}=req.body;//extract the msgId from the request body
        const userId=req.body.userId;//extract the userId from the request body which was added by the authenticate middleware

        const message=await prisma.message.findUnique({where:{id:msgId}});//find the message with the given msgId
        if(!message){
            return res.status(404).json({message:"Message not found"});//if message not found return 404
        }
        //check if the user is the sender of the message and only then allow to delete the message
        if(message.senderId!==userId){
            return res.status(401).json({message:"Unauthorised to delete the message"});//if the user is not the sender of the message,return 401
        }
        //delete the message
        await prisma.message.delete({where:{id:msgId}});
        res.status(200).json({message:"Message deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Error deleting message"});
    }
};