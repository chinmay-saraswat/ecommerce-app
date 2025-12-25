import express from "express"
import path from "path";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest,functions } from "./config/inngest.js";

const app = express();
app.use(express.json());

const __dirname = path.resolve();

app.use(clerkMiddleware())

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api",(req,res)=>{
    res.status(200).json({message:"success"})
})

// make our app ready for deployment 
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../admin/dist")));

    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../admin","dist","index.html"));
    })
}

const startServer = async()=>{
    await connectDB();
    app.listen(ENV.PORT,()=>{console.log("server is running on port 3000 ");        
    });
}

startServer();
