import { Request, Response, NextFunction } from "express";
import User, { IUserDocument } from "../models/user.model";
import jwt from 'jsonwebtoken'


// Extend the Express Request type to include the user
interface AuthRequest extends Request {
    user?: IUserDocument | null;
}

export const auth = async(req:AuthRequest,res:Response,next:NextFunction)=>{

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

        try{
            // get the token from header
            token = req.headers.authorization.split(" ")[1];

            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id:string};
            req.user = await User.findById(decoded.id);
console.log("token verified")
            if(!req.user){
                return res.status(401).json({ message: "User not found" });
            }

            next()

        }catch(error){
            return res.status(401).json({ message: "Not authorized" });
        }
    }
    if (!token) {
        
        return res.status(401).json({ message: "No token provided" });
    }
};
