const mongoose = require("mongoose")
const { default: isEmail } = require("validator/lib/isEmail")


const authorSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    },
    title:{
        type:String,
        enum:["Mr","Mrs","Miss"]
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        validate:[isEmail,'invalid email']
        
    },
    password:{
        type:String,
        trim:true,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model("authors", authorSchema)