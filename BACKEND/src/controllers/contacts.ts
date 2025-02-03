import { Request, Response } from "express";
import { prisma } from "../db";

export const contacts=async(req:any,res:any)=>{
    try{
        const userId=req.body.userId;//extract the userId from the request body which was added by the authenticate middleware
        const user=await prisma.user.findUnique({where:{id:userId}});//find the user with the given userId
        const contacts=await prisma.user.findUnique({where:{id:userId}}).contacts();//find all contacts of the user

        res.status(200).json({"contacts":contacts?.map((contact:any)=>{return {contactuserId:contact.id,contactName:contact.username}})});//we return the contacts as an array of objects with contactuserId and contactName
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Error fetching contacts"});
    }
};