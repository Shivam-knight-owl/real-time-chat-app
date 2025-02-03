import { Request, Response } from "express";
import { prisma } from "../db";

export const messages=async(req:any,res:any)=>{
    try{
        const {contact_username}=req.params;//extract the contact username from the request params
        const userId=req.body.userId;//extract the userId from the request body which was added by the authenticate middleware

        const contact=await prisma.user.findUnique({where:{username:contact_username}});//find the user with the given username

        if(!contact){
            return res.status(404).json({message:"User not found"});//if user not found return 404
        }

        //find all messages between the two users
        const messages=await prisma.message.findMany({
            where:{
                OR:[
                    {
                        senderId:userId,
                        receiverId:contact.id
                    },
                    {
                        senderId:contact.id,
                        receiverId:userId
                    }
                ]
            }
        });

        //we want details of message to be sent to the client in response
        res.status(200).json({messages:messages.map((msg:any)=>{
            return{
                messageId:msg.id,
                text:msg.text,
                sender:{
                    id:msg.senderId,
                    username:msg.senderId===userId?"You":contact_username
                },
                receiver:{
                    id:msg.receiverId,
                    username:msg.receiverId===userId?"You":contact_username
                },
                timestamp:msg.createdAt
            }// we send a single object with messages as key and value as array of objects which have messageId,text,sender,receiver,timestamp
        })});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Error fetching messages..."});
    }
};