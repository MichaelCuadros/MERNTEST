const {Schema,model}=require('mongoose');

const CourseSchema=Schema({
    code:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    create_at:{
        type:Date,
        default:Date.now
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    userIds: {
        type: [Schema.ObjectId]
    },
    url:{
        type:String
    },
    url_portada: {  // nuevo campo para la URL de la portada del curso
        type: String,
        default: ''  // puedes poner un valor por defecto si lo deseas
    }
})


module.exports=model("Course",CourseSchema,"courses");