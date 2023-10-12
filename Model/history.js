const {Schema, model} = require('mongoose');

const HistorySchema=Schema({
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
    }

});

module.exports=model("History",HistorySchema,"histories");