const {Schema, model} = require('mongoose');

const QuestionSchema=Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    moduleId:
    {
        type:Schema.ObjectId
    }

});

module.exports=model("Question",QuestionSchema,"questions");