import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken'



// register 
export const registerUser = async(req:Request,res:Response)=>{

    try{
        const{name,email,password} = req.body;

        // check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message:"User already exist"});
       
        // create new user
        const user = await User.create({name,email,password});
        console.log("User saved to collection:", User.collection.name);
        console.log("Database in use:", User.db.name);
        
        res.status(201).json({
            success:true,
            user:{
                id:user._id,
                name:user.name,
            },
            message:"Registered successfully"
        })
    }catch(error:any){
        console.error("Caught a registration error");
        
       res.status(400).json({ 
        success: false, 
        message: error.message || "Failed to register user",
        errors: error.errors 
    })
    }
}

// login

export const loginUser = async (req:Request,res:Response)=>{

    try{

        const {email,password} = req.body

        // email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email format"
            });
        }

        // find user
        const user = await User.findOne({email});
        if(!user){
           return res.status(401).json({
                message:"User doesn't exists. Please register"
            })
        }

        // check if password matches using our schema method
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(401).json({
                message:"invalid credentials"
            })
        }

        // generatr token
        const token = jwt.sign({id:user._id,},process.env.JWT_SECRET!,{expiresIn:'15m'})
console.log(token)
        res.status(200).json({
            success:true,
            token,
            message:"login successfully"
        })
    }catch(error){
        console.error("Caught a login error");
        
        res.status(400).json({ 
            success: false, 
            message: "Failed to login user" 
        });
    }
}
