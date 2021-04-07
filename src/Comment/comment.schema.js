import mongoose, { mongo, Mongoose, SchemaTypes } from 'mongoose';

const {Schema} = mongoose

const baseOptions = {
    discriminatorKey: '__type',
    collection: 'Comments',
    timestamps: true
}
const Base = mongoose.model('Base', new Schema({}, baseOptions));

const parentCommentSchema = Base.discriminator('parentComment', new mongoose.Schema({
    poster: {
        //User ObjectID
        type: String,
        require: true,
    },
    restaurant:{
        //Restaurant ObjectID
        type: String,
    },
    content: {
        type: String,
        require: true,
    },

}));

parentCommentSchema.methods = {
    toJSON() {
        return {
            _id: this._id,
            poster: this.poster,
            restaurant: this.restaurant,
            content: this.content
        }
    }
}

const childCommentSchema = Base.discriminator('childComment', new mongoose.Schema({
    poster: {
        //User ObjectID
        type: String,
        require: true,
    },
    restaurant: {
        type: String,
    },
    content:{
        type: String,
        require: true,
    },
    parent: {
        type: String,
        require: true
    },
}));

childCommentSchema.methods = {
    toJSON() {
        return {
            _id: this._id,
            poster: this.poster,
            restaurant: this.restaurant,
            content: this.content,
            parent: this.parent,
        }
    },
}


module.exports = {
    Base: Base,
    parentCommentSchema: parentCommentSchema,
    childCommentSchema, childCommentSchema
    
}