import { Mongoose } from "mongoose";
import {Base, parentCommentSchema, childCommentSchema} from "./comment.schema.js";
import { addParentCommentValidation } from "./comment.validation.js";

//create parent comment

export const addParentComment = async (req, res) => {
    const {error} = addParentCommentValidation(req.body)

    if(error) {
        return res.json({error: true, data: error.details[0].message})
    }

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
    try{
        //getParentComment
        commentRequest = await parentCommentSchema.find({poster: req.query.poster});
        //console.log(res.data);
        console.log(commentRequest)
        return res.json({data:commentRequest});
    }
    catch(error){
        console.log(`Failed to get commments from the backend: ${error}`);  
        res.json({error: true, data: error})
    }
}

export const findChildComments = async (req, res) => {
    var childCommentRequest;
    console.log(req.query.parent);
    try{
        //getChildComment
        childCommentRequest = await childCommentSchema.find({parent: req.query.parent});
        console.log(childCommentRequest);
        console.log({data:childCommentRequest})
        return res.json({data:childCommentRequest});
    }
    catch(error){
        console.log(`Failed to get child commments from the backend: ${error}`);  
        res.json({error: true, data: error})
}
}
