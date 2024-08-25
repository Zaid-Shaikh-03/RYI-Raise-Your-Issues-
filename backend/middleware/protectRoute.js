import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        if(typeof token !== 'string'){
            return res.status(401).json({error:"Unauthorized: No token provided"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded  || !decoded.userId){
            return res.status(401).json({error:"Unauthorized: Invalid token"})
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({error:"No user found"});
           }
        req.user = user;
        next();
       
    } 
    catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
        }
        
        console.log("Error in protectRoute middleware",error.message);
        res.status(500).json({error:"Invalid Server Error"})
    }
}