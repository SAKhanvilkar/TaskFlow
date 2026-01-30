import mongoose, { Schema, Document } from "mongoose";

// The interface defines what a Counter looks like
export interface ICounter {
    modelName: string;
    seq: number;
}

// Extend Document so Mongoose can use it
export interface ICounterDocument extends ICounter, Document {}

const counterSchema = new Schema<ICounterDocument>({
    modelName: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 }
});

export const Counter = mongoose.model<ICounterDocument>("Counter", counterSchema);