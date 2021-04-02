import { Mongoose } from "mongoose";
import {Base, parentCommentSchema, childCommentSchema} from "./comment.schema.js";

//create parent comment

export const addParentComment = async (req, res) => {
    console.log(req.body)
    try{
        const parentComment = await parentCommentSchema.create(req.body)
        res.json({error: false, data: parentComment.toJSON()})
    }
    catch(e){
        res.json({error: true, data: e})
    }
}

export const addChildComment = async (req, res) => {
    console.log(req.body)
    try{
        const childComment = await childCommentSchema.create(req.body)
        res.json({error: false, data: childComment.toJSON()})
    }
    catch(e){
        res.json({error: true, data: e})
    }
}

export const findComments = async (req, res) => {
    var commentRequest;
    console.log(req.body);
    try{
        commentRequest = await Base.find({poster: req.body.poster});
        //console.log(res.data);
        //console.log(commentRequest)
        console.log({data:commentRequest});
        return res.json({data:commentRequest});
    }
    catch(error){
        console.log(`Failed to get commments from the backend: ${error}`);  
        res.json({error: true, data: error})
    }
}