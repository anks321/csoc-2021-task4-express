var mongoose=require("mongoose");
//DEFINING THE BOOK  COPIES MODEL
var bookCopySchema=new mongoose.Schema({
//TODO: DEFINE the following attributes-
 book:{ type: mongoose.Schema.Types.ObjectId, ref: 'user'} ,  //embed reference to id of book of which its a copy
status :{type:Boolean,required:true,default:true}, //TRUE IF AVAILABLE TO BE ISSUED, ELSE FALSE 
 borrow_date: {
type:Date,
 },//date when book was borrowed
 borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }//embed reference to id of user who has borrowed it 
})
module.exports=mongoose.model("Bookcopy",bookCopySchema);