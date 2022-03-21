const authorModel = require("../models/authorModel")
const blogsModel = require("../models/blogsModel");
const jwt = require('jsonwebtoken');



//phase =1st
//part1
const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        let savedata = await authorModel.create(data);
        res.status(201).send({ status: true, msg: savedata })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

//part2
const createBlog = async function (req, res) {
    try {
        let data = req.body;
        let data1 = req.body.authorId;
        let savedata = await authorModel.findById(data1);

        if (!savedata) {
            res.status(400).send({ status: false, msg: 'No such authorId is Present' });
        }
        let savedata1 = await blogsModel.create(data)
        res.status(201).send({ status: true, msg: savedata1 })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


//part3
const getBlogs = async function (req, res)
{
    try 
    {
        const toFind = req.query

        const collection = await blogsModel.find({$and : [toFind, {isPublished:true}]})//(toFind)
        if (collection.length==0) 
        {
            res.status(400).send({ status: false, msg: "Not Found" })
        }
        console.log(collection)
        res.status(201).send({ status: true, message: collection })
    }
    catch (err) 
    {
        res.status(500).send({ status: false, msg: err.message })
    }
}



//part4
const updateBlogs = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let findBlogId = await blogsModel.findById(blogId)
        if (!findBlogId) {
            res.status(404).send({ status: false, msg: 'blog not found' })
        }
        let data = req.body;
        let savedata = await blogsModel.updateMany({ _id: blogId }, { $set: data }, { new: true })
        let updates = await blogsModel.updateMany({ _id: blogId }, { isPublished: true }, { new: true })
        res.status(200).send({ status: true, msg: updates })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



//part 5
const deleteBlogs = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (Object.keys(blogId).length == 0) {
            res.status(400).send({ status: false, msg: "BlogsId Required" })
        }
        let blogDetails = await blogsModel.find({ _id: blogId }, { isDeleted: false })
        if (!blogDetails) {
            res.status(404).send({ status: false, msg: "Blogs Not Found" })
        } else {

            let deleteData = await blogsModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true })
            deleteData.deletedAt = Date()
            deleteData.save()
            res.status(201).send({ status: true, data: deleteData })

        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }


}
//part6
const deleteByAddress = async function (req, res) {
    try {
        let authorId = req.query.authorId
        let category = req.query.category
        if (!authorId) {
            res.status(400).send({ status: false, msg: "AuthorId Required" })
        }
        if (!category) {
            res.status(400).send({ status: false, msg: "Category Required" })
        }
        let authorDetails = await authorModel.find({ _id: authorId })
        if (!authorDetails) {
            res.status(404).send({ status: false, msg: "AuthorId Not Exist" })
        } else {
            let updateDetails = await blogsModel.updateMany({ authorId: authorId, category: category }, { $set: { isDeleted: true } })
            updateDetails.deletedAt = Date()
            res.status(201).send({ status: true, data: updateDetails })

        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

//phase = 2nd
//part 1
// const loginUser = async function (req, res) {
//     try{
//         const requestBody=req.body;
//         if(!isValidRequestBody(requestBody)){
//             res.status(400).send({status:false,msg:"Invalid request parameters.Please provide login details"})
//             return
//         }
//         const{email, password}=requestBody;

    
//     if(!isvalid(email)){
//         res.status(400).send({status:false,msg:"Email is required"})
//         return
//     }
//     if(!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))){
//         res.status(400).send({status:false, msg:"email should be a valid email address"}) 
//         return 
//     }
//      if(!isvalid(password)){
//             res.status(400).send({status:false,msg:"Password is required"})
//             return
//      }

//     let author= await authorModel.findOne({ email,password });
//     if (!author)
//       return res.status(401).send({
//         status: false,
//         msg: "Invalid login credentials",
//       });

//       let token = await jwt.sign({ 
//         authorId: author._id,
//         iat:Math.floor(Date.now()/ 1000),
//         exp:Math.floor(Date.now()/1000 + 10*60*60)
//       },   `someverysecuredprivatekey291@(#(@(@()`)
       
//       res.header('x-api-key',token),
//        res.status(201).send({ status: true, msg: "Succesfully LogedIn.Here is a access Token", token: {token}});
//      } catch(error){
//         console.log(error)
//         res.status(500).send({ msg: error.message })
//     }
//   }
const loginUser = async function(req, res){
    try{
        let userName = req.body.emailId;
        let password = req.body.password;

        let user = await authorModel.findOne({ emailId : userName , password : password });

        if(!user)
        return res.send({ status : false , msg : " username or password is not correct"});

        let token = jwt.sign({ userId : user._id.toString( )},"Blog");
        res.status(201).send({ status : true , msg : "succesfully  logedIn. here is a access token",token : token})

    }

    catch (error){
        console.log(error)
        res.status(500).send({msg:error.message})
    }
   
}





module.exports.createAuthor = createAuthor
module.exports.getBlogs = getBlogs
module.exports.createBlog = createBlog
module.exports.updateBlogs = updateBlogs
module.exports.deleteBlogs = deleteBlogs
module.exports.deleteByAddress = deleteByAddress


module.exports.loginUser = loginUser