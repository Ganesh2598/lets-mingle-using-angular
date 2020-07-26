const router = require("express").Router();
const User = require("../database").user;
const Friends = require("../database").friends;
const requireLogin = require("../middleware/requireLogin");


router.post("/addfriend",requireLogin, (req, res)=> {
    const friendData = {
        name : req.body.friendname,
        imageUrl : req.body.url,
        fk_userid : req.body.myid,
        userid : req.userData.userid
    }

    Friends.create(friendData)
        .then(data =>{
            res.json(data)
        })
        .catch(err =>{
            res.json({
                error : err
            })
        })
})

router.get("/myfriends",requireLogin, (req, res)=> {
    const id = req.userData.userid
    Friends.findAll({where : {userid : id}})
        .then(data =>{
            res.json(data)
        })
        .catch(err =>{
            res.json({
                error : err
            })
        })
})

router.get("/allfriends",requireLogin, (req, res)=> {
    User.findAll({
        attributes : ["userid"]
    })
        .then(data => {
            const alluserids = data.map(item => item.userid)
            Friends.findAll({
                where : {userid : req.userData.userid},
                attributes : ["fk_userid"]
            }).then(frienddata=>{
                const friendids = frienddata.map(item => item.fk_userid)
                const list = alluserids.filter(user => friendids.indexOf(user)<0)
                const finalist = list.filter(user => user!=req.userData.userid)
                User.findAll({
                    where : {userid : finalist}
                }).then(result =>{
                    res.json(result)
                }).catch(err=> {
                    res.json({
                        error : err
                    })
                })
            }).catch(err => {
                res.json({
                    error : err
                })
            })
        })
        .catch(err =>{
            res.json({
                error :err
            })
        })
})

router.get("/userfriends/:id",requireLogin, (req, res)=> {
    const id = req.params.id
        Friends.findAll({where : {fk_userid : id}})
        .then(data =>{
            const friends = data.map(item => item.userid)
            res.json(friends)
        })
        .catch(err =>{
            res.json({
                error : err
            })
        })
})

router.delete("/removefriend/:id",requireLogin,(req, res)=> {
    Friends.destroy({
        where : { id: req.params.id } 
    }).then(data=>{
        res.json({
            msg : "success"
        })
    }).catch(err =>{
        console.log(err)
        res.json({
            error : err
        })
    })
})

router.get("/everyone",requireLogin,(req, res)=>{
    User.findAll(
    ).then(data=>{
        res.json(data)
    }).catch(err=>{
        console.log(err)
        res.json({
            error : err
        })
    })
})

module.exports = router;