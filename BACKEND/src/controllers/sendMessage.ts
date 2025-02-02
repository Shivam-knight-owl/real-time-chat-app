import { prisma } from "../db";

export const sendMessage=async(req:any,res:any)=>{
    try{
        // console.log(req.body);
        const {receiver,msg}=req.body;
        const senderId=req.body.userId;//extract the sender's userId from the request body which was added by the authenticate middleware

        console.log("full req.body",req.body);
        console.log("Receiver username from req.body:", receiver);
        const receiverUser=await prisma.user.findUnique({where:{username:receiver}});//find the user with the given username
        if(!receiverUser){
            return res.status(404).json({message:"User not found"});//if user not found return 404
        }
        //save msg in db
        const message=await prisma.message.create({
            data:{
                text:msg,
                senderId:senderId,
                receiverId:receiverUser.id,
            }
        });

        //fetch sender details to include in response
        const senderUser=await prisma.user.findUnique({where:{id:senderId}});
        //detailed message object to be sent to the client in response
        const messageDetails={
            messageId:message.id,
            text:message.text,
            sender:{
                id:senderUser?.id,
                username:senderUser?.username
            },
            receiver:{
                id:receiverUser.id,
                username:receiverUser.username
            },
            timestamp:message.createdAt,
        }
        
        res.status(200).json({message:"Message sent successfully", data: messageDetails});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Error sending message"});
    }
};