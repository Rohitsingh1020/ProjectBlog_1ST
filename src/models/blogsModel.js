const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    authorId :{
        required:true,
        type:ObjectId,
        ref:"authors"
    },
    tags:{
        type:[String]
    },
    category:String,
    subcategory:{
        type:[String]
    },
    isPublished:{
        type:Boolean,
        default:false,
    },
    publishedAt:Date,

    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:Date,
},{timestamps:true})


module.exports = mongoose.model("Blogs", blogSchema)