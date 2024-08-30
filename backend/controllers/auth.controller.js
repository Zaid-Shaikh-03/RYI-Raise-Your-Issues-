import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res) =>{
    try {
        const {fullName,username,email,password,organization} = req.body;
        

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
            password:hashedPassword,
            organization,
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
                organization:newUser.organization,


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
    try{

        const username = req.body.username;
        const password = req.body.password
        const user = await  User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password , user?.password || "" );
        


        if(!user ){
            return res.status(400).json({
                error:"Invalid username "
            })
        }
        else if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid  password' });
        }

        generateTokenAndSetCookie(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            email:user.email,
            followers:user.followers,
            following:user.following,
            profileImg:user.profileImg,
            coverImg:user.coverImg,
            organization:user.organization,
        })
        
        

    }catch(error){
        console.log("Error in login controller",error.message);
        res.status(500).json({error:"Invalid Server Error"})
    }
}
export const logout = async (req,res) =>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({
            message:"Logout successfully"
        })
    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({error:"Invalid Server Error"})
    }
}

export const getMe = async (req, res) => {
    try {
        // Ensure you await the asynchronous call
        const user = await User.findById(req.user._id).select('-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};