const router = require("express").Router();
const Post = require("../database").post;
const Comments = require("../database").comments;
const Childcomments  = require("../database").childcomments;
const requireLogin = require("../middleware/requireLogin");

router.post("/addcomment",requireLogin,(req, res)=> {
    const postData = {
        fk_postid : req.body.fk_postid,
        comment : req.body.comment,
        username : req.userData.name,
        userid : req.userData.userid
    }
    Comments.create(postData)
        .then(data =>{
            res.json(data)
        })
        .catch(err =>{
            res.json({
                error : err
            })
        })
})

router.post("/addsubcomment",requireLogin,(req, res)=> {

    const commentData = {
        fk_commentid : req.body.fk_commentid,
        comment : req.body.comment,
        username : req.userData.name,
        userid : req.userData.userid
    }
    Childcomments.create(commentData)
        .then(data =>{
            res.json(data)
        })
        .catch(err =>{
            res.json({
                error : err
            })
        })
})

router.get("/comments/:id",requireLogin,(req, res)=> {
    const id = req.params.id
    Comments.findAll({
        where : {fk_postid : id }
    }).then(data =>{
        res.json(data)
    }).catch(err =>{
        res.json({
            error : err
        })
    })
})

module.exports = router;

