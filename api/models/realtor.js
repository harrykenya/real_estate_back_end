const mongoose = require('mongoose');

const realtorSchema = mongoose.Schema({ //defines how product should look like
  _id: mongoose.Schema.Types.ObjectId, //consturctor function
  name: {type:String, required: true},
  realtorImage:{type:String, required:true},
  email:{
   type: String, 
   required: true, 
   unique: true, 
   match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
},//regex for email match
 password:{type:String, required:true}  
});

module.exports = mongoose.model('Realtor', realtorSchema); 