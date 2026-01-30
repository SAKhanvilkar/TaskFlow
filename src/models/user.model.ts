import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Document } from "mongoose";
import { Counter } from "./counter.model";

export interface IUser {
    name:string;
    email:string;
    password:string;
    id?: number;
    
}

export interface IUserDocument extends Omit<Document, 'id'>, IUser {
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
    name:{
        type:String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters"]
    },
    email:{
        type:String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
    },
    password:{
        type:String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    id: { type: Number, unique: true },
},
    {
        timestamps:true

    });

// hashing and auto incrementing ID
 userSchema.pre('save',async function (this:IUserDocument){

if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { modelName: "user" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            if (counter) {
                this.id = counter.seq;
            }
        } catch (error: any) {
            console.log(error)
        }
    }

        // only has the pass if its modified or new
        if(!this.isModified('password')){
            return;
        }

        try{
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password,salt);
            
        }catch(error){
             console.log("hashing error")
            throw error;
        }

    });

    userSchema.methods.matchPassword = async function (enteredPassword:string):Promise<boolean>{
        return await bcrypt.compare(enteredPassword, this.password)
    }
const User = mongoose.model <IUserDocument> ("User", userSchema);
export default User;