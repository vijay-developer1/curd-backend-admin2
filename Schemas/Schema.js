const mongoose=require('mongoose')

const AdminSchema=new mongoose.Schema({
    First_Name:{
        type:String,
        required: true
    },
    Last_Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique: true
    },
    Phone:{
        type:String,
        required:true,
        unique:true
    },
    Gender:{
        type:String,
        enum:['Male','Female','Other']
    },
    profile_pic:{
        type:String,
        required:false
    }
    

})
module.exports=mongoose.model("CurdAPI",AdminSchema)