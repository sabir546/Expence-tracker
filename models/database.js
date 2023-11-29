const mongoose= require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Expenses-track');
const plm= require('passport-local-mongoose')

const userSchema=new mongoose.Schema({
 username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    
  },
  newPassword: {
    type: String,
    
  },
  token:{
    type:Number,
    default:-1
  },
  expences:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'expence'
  }]


},

{timestamps:true});

userSchema.plugin(plm);
// userModel.plugin(plm, { usernameField: "email" });

module.exports=mongoose.model("user", userSchema)


