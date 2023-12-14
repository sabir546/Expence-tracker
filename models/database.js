const mongoose= require('mongoose');
mongoose.connect('mongodb+srv://mdgulamsabir9:JQOjbnrrL0iMvA57@cluster2.xbyw3f5.mongodb.net/?retryWrites=true&w=majority');
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


