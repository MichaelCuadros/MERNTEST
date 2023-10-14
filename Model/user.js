const {Schema,model}=require('mongoose');

const UserSchema=Schema({
    name:{
        type:String,
        required:true,
        maxlength: 20
    },
    username:{
        type:String,
        required:true,
        unique:true,
        maxlength: 20
    },
    password:{
        type:String,
        required:true,
        minLength:1
    },
    create_at:{
        type:Date,
        default:Date.now
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    modules: {
        type: [Schema.ObjectId]
    },
    rank:{
        type:String,
        default:"user"
    },
    logins:{
        type:[Date]
    },
    token_: { 
        type: String,
        default:""
    },
    number: {
        type: Number, 
        default: 0,   
    },
    group: {  // <-- Aquí agregamos el campo de token
        type: String,
        default:"",
        maxlength: 20
    },
    symbols: {
        type: [String],
        default: ["novice"]
    },
})



module.exports=model("User",UserSchema,"users");