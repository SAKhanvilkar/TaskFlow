import mongoose, { Document, Schema, Types } from "mongoose";
import { Counter } from "./counter.model";

export interface ITask extends Document {
    user_id: Types.ObjectId;
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "completed";
    due_date: Date;
    id?: number;
}

export type ITaskDocument = Omit<Document, 'id'> & ITask;

export const taskSchema = new Schema <ITaskDocument> ({
    user_id:{
        type:Schema.Types.ObjectId,
        ref: "User", // Owner the task
        required:true
    },
    title:{
        type:String,
        required:[true,"Task title is required"],
        minlength: [3, "Title must be at least 3 characters"],
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    priority:{
        type: String,
        enum: {
            values: ['low', 'medium', 'high'],
            message: "Priority must be low, medium, or high"
        },
        default: "medium"
    },
    status:{
        type:String,
        enum: {
            values: ['pending', 'in_progress', 'completed'],
            message: "Invalid status value"
        },
        default: "pending"
    },
    due_date:{
        type:Date,
        required: true,
        validate: {
            validator: function(value: Date) {
                // Check if date is greater than "now"
                return value > new Date();
            },
            message: "Due date cannot be in the past"
        }
    },
    id: { type: Number, unique: true }
},{
    timestamps:true
})

// auto incrementing ID
taskSchema.pre('save', async function (this: ITaskDocument) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { modelName: "task" }, // Unique identifier for task counts
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            if (counter) this.id = counter.seq;
            
        } catch (error: any) {
            console.log(error)
            
        }
    } 

});

const Task = mongoose.model<ITask>("Task",taskSchema);
export default Task;