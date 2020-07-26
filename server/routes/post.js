const router = require("express").Router();
const User = require("../database").user;
const Post = require("../database").post;
const requireLogin = require("../middleware/requireLogin");
const comments = require("../models/comments");
const Friends = require("../database").friends;
const Sequelize = require("../database").Sequelize;
const Comments = require("../database").comments;
const Childcomments = require("../database").childcomments;

router.post("/createpost",requireLogin,(req, res)=> {
    const postData = {
        caption : req.body.caption,
        imageUrl : req.body.url,
        fk_userid : req.userData.userid,
        userName : req.userData.name,
        status : req.body.status
    }
    
    Post.create(postData)
    .then(data => {
        res.json(data)
    })
    .catch(err =>{
        res.json({
            error : err
        })
    })
})

router.get("/mypost",requireLogin,(req, res)=> {
    Post.findAll({where : {fk_userid : req.userData.userid}})
        .then(posts =>{
            res.json(posts)
        })
        .catch(err=> {
            res.json({
                error : err
            })
        })
})

router.get("/userpost/:id",requireLogin, (req, res)=> {
    const id = req.params.id
    Post.findAll({where : {fk_userid : id}})
        .then(data =>{
            res.json(data)
        })
        .catch(err =>{
            console.log(err)
            res.json({
                error : err
            })
        })
})

router.get("/allpost",requireLogin,(req, res)=> {
    Post.findAll({
        where : {
            status : "public"
        },
        include : [{
            model : Comments,
            include : [Childcomments]
        }]
    }).then(publicposts =>{
        console.log(publicposts)
        Friends.findAll({
            where : {fk_userid : req.userData.userid}
        }).then(friends =>{
            const followers = friends.map(item => item.userid)
            Post.findAll({
                    where : Sequelize.and(
                            {status : "private"},
                            {fk_userid : followers}
                        ),
                        include : [{
                            model : Comments,
                            include : [Childcomments]
                        }]
            }).then(data =>{
                const mergelist = [...data, ...publicposts]
                mergelist.sort((x, y)=> y.createdAt - x.createdAt)
                res.json(mergelist)
            })
        })
    })
})


router.post("/createprivatepost",requireLogin,(req, res)=> {
    const postData = {
        caption : req.body.caption,
        imageUrl : req.body.url,
        fk_userid : req.userData.userid,
        userName : req.userData.name
    }
    
    Privatepost.create(postData)
    .then(data => {
        res.json(data)
    })
    .catch(err =>{
        res.json({
            error : err
        })
    })
})

router.get("/friendspost",requireLogin,(req, res)=> {
    Friends.findAll({
        where : {fk_userid : req.userData.userid},
        attributes : ["userid"]
    }).then(friends =>{
        const followers = friends.map(item => item.userid)
        Privatepost.findAll({
            where : {fk_userid : followers}
        }).then(data =>{
            res.json(data)
        }).catch(err =>{
            res.json({
                error : err
            })
        })
    })
})

module.exports = router;