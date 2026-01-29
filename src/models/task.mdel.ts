import mongoose, { Schema, Types } from "mongoose";

export interface ITask {
    user_id: Types.ObjectId;
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "completed";
    due_date: Date;
} 

const taskSchema = new Schema <ITask> ({
    user_id:{
        type:Schema.Types.ObjectId,
        ref: "User", // Owner the task
        required:true
    },
    title:{
        type:String,
        required:[true,"Task title is required"],
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    priority:{
        type: String,
        enum: ["low" , "medium" , "high"],
        default: "medium"
    },
    status:{
        type:String,
        enum:["pending" , "in_progress" , "completed"],
        default: "pending"
    },
    due_date:{
        type:Date
    }
},{
    timestamps:true
})

const Task = mongoose.model<ITask>("Task",taskSchema);
export default Task;