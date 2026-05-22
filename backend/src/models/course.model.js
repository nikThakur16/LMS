import mongoose from "mongoose";

const courseSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },

    thumbnail:{
        type:String
    },
    amount:{
        type:Number,
        required:true
    },

    modules:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Modules"
        }
    ],
    whatYouLearn: [{ type: String }],
    requirements:  [{ type: String }],
    level:    { type: String, default: 'Beginner' },
    language: { type: String, default: 'English' },
    totalDuration: { type: String, default: '' }
},{timestamps:true})


export const Course = mongoose.model("Course", courseSchema)