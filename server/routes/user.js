const router = require("express").Router();
const User = require("../database").user;
const Post = require("../database").post;
const requireLogin = require("../middleware/requireLogin");

router.get("/userposts",requireLogin,(req, res)=> {
    const userId = req.body.id
    User.findOne({where : {userid : userId},include : [Post]})
    .then(data =>{
        res.json(data)
    })
    .catch(err=> {
        console.log(err)
        res.json({
            error : err
        })
    })
})

router.get("/userinfo",requireLogin, (req, res)=> {
    User.findOne({where : {userid : req.userData.userid}})
        .then((data)=> {
            res.json(data)
        })
        .catch(err =>{
            res.json({
                error :err
            })
        })
})

router.get("/userinfo/:id",requireLogin, (req, res)=> {
    const id = req.params.id
    User.findOne({where : {userid : id}})
        .then((data) =>{
            res.json(data)
        })
        .catch(err =>{
            res.json({
                error :err
            })
        })
})


module.exports = router;
