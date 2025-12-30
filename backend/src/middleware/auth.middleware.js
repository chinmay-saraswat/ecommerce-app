import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
    requireAuth(),
    async(req,res,next)=>{
        try {
            const clerkId = req.auth().userId;
            if(!clerkId) return res.status(401).json({message:"unauthorized acess - invalid token"});

            const user = await User.findOne({clerkId});
            if(!user) return res.status(404).json({message:"user not found"});

            req.user=user; //attach the user with request when user is found
            next();
        } catch (error) {
            console.log("error in protectedRoute Middleware",error);
            res.status(500).json({message:"internal server error"});
        }
    }
]

export const adminOnly = async(req,res,next)=>{
     if(!req.user){
        return res.status(401).json({message:"unauthorised user not found  "})
    }
    if(req.user.email!== ENV.ADMIN_EMAIL){
        return res.status(403).json({message:"Forbidden admin acess only "})
    }

    next();
}

