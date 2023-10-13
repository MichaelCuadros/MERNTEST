const { Schema, model } = require('mongoose');

const CommentSchema = Schema({
    userId: {
        type: Schema.ObjectId,
        ref:"User"
    },
    moduleId: {
        type: Schema.ObjectId
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    comment:{
        type:String,
        maxlength: 120
    }
})

module.exports = model("Comment", CommentSchema, "comments");