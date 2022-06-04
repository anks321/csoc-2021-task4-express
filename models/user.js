var mongoose=require("mongoose");
var passport=require("passport")
var bcrypt = require("bcrypt-nodejs")
//DEFINING THE USER MODEL
var userSchema=new mongoose.Schema({

	//TODO: DEFINE USERNAME AND PASSSWORD ATTRIBUTES
    username:{
        type:String,
        required:true
    },email:{
        type:String,
        required:true
    },password:{
        type:String,
        required:true,
    }
    ,
    loaned_books:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'books'
        }
        //TODO: embed reference to id's of book copies loaned by this particular user in this array
    ]
})
userSchema.methods.hashPassword=(password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}
userSchema.methods.comparePassword=(password,hash)=>{
    return bcrypt.compareSync(password,hash);
}
module.exports=mongoose.model("users",userSchema,"users");