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
  
  token:{
    type:Number,
    default:-1
  },
  expenses:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'expense'
  }]


},

{timestamps:true});

// userSchema.plugin(plm);
userSchema.plugin(plm, { usernameField: "email" });

module.exports=mongoose.model("user", userSchema)


