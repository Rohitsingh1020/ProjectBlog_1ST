const express = require('express');
const router = express.Router();
const allControllers = require("../controllers/allControllers")
const middleware = require("../middleware/authentication")


router.post("/authors", allControllers.createAuthor);

router.post("/blogs", allControllers.createBlog);

router.get("/getblogs", allControllers.getBlogs);

router.put("/updateBlogs/:blogId", middleware.authenticate,allControllers.updateBlogs)

router.delete("/deleteBlogs/:blogId", middleware.authorization,allControllers.deleteBlogs)


router.delete("/deleteByAddress", allControllers.deleteByAddress)


router.post("/login",allControllers.loginUser)

// router.post("/loginUser", middleware, allControllers.loginUser)


module.exports = router;