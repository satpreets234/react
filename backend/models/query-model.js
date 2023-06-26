const mongoose=require('mongoose');
const userModel = require('./user-model');
const querySchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    query:{
        type:String,
        required:true
    },
    name:{
        type:String,
        default:false

    }
    
})

module.exports= mongoose.model('query',querySchema);