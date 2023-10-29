const {Schema, model} = require('mongoose');

const MediaSchema=Schema({
    title:{
        type:String
    },
    description:{
        type:String,
        required:true
    },
    create_at:{
        type:Date,
        default:Date.now
    },
    userId: {
        type: Schema.ObjectId
    },
    urlVideo:{
        type:String
    },
    moduleId:{
        type:Schema.ObjectId
    }

});

module.exports=model("Media",MediaSchema,"medias");