import { Request, Response } from "express";
import { prisma } from "../db";

export const me=async(req:any,res:any)=>{
    try{
        const userId=req.body.userId;//extract the userId from the request body which was added by the authenticate middleware
        const user=await prisma.user.findUnique({where:{id:userId}});//find the user with the given userId
        res.status(200).json({user});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Error fetching user"});
    }
};