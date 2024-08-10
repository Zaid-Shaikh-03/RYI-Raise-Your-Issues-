import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res) =>{
    try {
        const {fullName,username,email,password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Invalid email format"})
        }

        const existinUser = await User.findOne({username});
        if(existinUser){
            return res.status(400).json({error:"Username already exist"})
        }

        const existinEmail = await User.findOne({email});
        if(existinEmail){
            return res.status(400).json({error:"Email already exist"})
        }

        if(password.length <6){
            return res.status(400).json({error:"Password length must be at least 6 character long"})
        }

        //hash passsword
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            username,
            email,
            password:hashedPassword
        })

        if(newUser){
            await newUser.save();
            generateTokenAndSetCookie(newUser._id,res)

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                email:newUser.email,
                followers:newUser.followers,
                following:newUser.following,
                profileImg:newUser.profileImg,
                coverImg:newUser.coverImg,


            })
        }else{
            res.status(400).json({error:"Invalid user data"})
        }

    } catch (error) {
        console.log("Error in signup controller",error.message);
        
        res.status(500).json({error:"Invalid Server Error"})
    }
}
export const login = async (req,res) =>{
    res.json({
        data:"You hit the login endpoint"
    })
}
export const logout = async (req,res) =>{
    res.json({
        data:"You hit the logout endpoint"
    })
}