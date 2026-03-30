const {Router} = require("express");
const path = require("path");
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment")

const router = Router();

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.resolve('./public/uploads'));
    },
    filename: function(req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    },
});

const upload = multer({storage: storage});


router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user: req.user,
    });
})

router.get('/:id', async (req,res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogID: req.params.id}).populate(
        'createdBy'
    );
    console.log(comments);
    // console.log(blog);
    return res.render('blog',{
        user: req.user,
        blog,
        comments,
    })
});

router.post('/comment/:blogID',async (req,res)=>{
    console.log(req.content);
    const com = await Comment.create({
        content: req.body.content,
        blogID: req.params.blogID,
        createdBy: req.user._id,
    });
    // console.log(com);
    // console.log(req.params.blogID);
    return res.redirect(`/blog/${req.params.blogID}`);
});

router.post('/',upload.single('coverImage'),async (req,res)=>{
    console.log(req.body);
    const {title,body} = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;