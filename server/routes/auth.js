const router = require("express").Router();
const User = require("../database").user;
const Post = require("../database").post;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const nodemailer = require("nodemailer");
const crypto = require("crypto");

require("dotenv").config();
const transport = nodemailer.createTransport({
    service : "Gmail",
    auth : {
        user : "ganesh2598259",
        pass : "mrstextiles"
    }
})

var randid;

router.post("/register",(req, res)=> {
    const userData = {
        name : req.body.name,
        email : req.body.email,
        imageUrl : req.body.url,
        password : req.body.password
    }

    if (!userData.email || !userData.password || !userData.imageUrl || !userData.name) {
        return res.json({
            error : "No Empty Fields"
        })
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userData.email))) {
        return res.json({
            error : "Invalid Email"
        })
    }


    User.findOne({where : {email : userData.email}})
        .then(user =>{
            if (user) {
                res.json({
                    error : "User already exists"
                })
            }else{
                const hash = bcrypt.hashSync(userData.password,10);
                const emailhash = bcrypt.hashSync(userData.email,10);
                if (hash && emailhash) {
                    userData.password = hash;
                    userData.hashedEmail = emailhash;
                    User.create(userData)
                    .then(data => {
                        const link = "http://localhost:5000/verify?hash="+emailhash;
                        const mailOption = {
                            to : userData.email,
                            subject : "Email Verification - Regarding",
                            html : "Hello,<br> Please click on the link below to verify your mail<br><a href="+link+">Click here</a>"
                        }
                        transport.sendMail(mailOption, (err, response)=> {
                            if (err) {
                                console.log(err)
                            }else{
                                console.log(response)
                            }
                        })
                        res.json(data)
                    })
                    .catch(err =>{
                        console.log(err)
                        res.json({
                            error : err
                        })
                    })
                }else{
                    res.json({
                        error : "Problem on hashing Password"
                    })
                }
            }
        })
        .catch(err =>{
            res.json({
                error : err.message
            })
        })
})

router.post("/login",(req, res)=> {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            error : "No Empty Fields"
        })
    }

    User.findOne({
        where : {email : email},
        attributes : ["userid","name","email","imageUrl","isverified","password"]
    })
        .then(userData =>{
            if(!userData) {
                return res.json({
                    error : "Username (or) Password is Wrong"
                })
            }
            if (!userData.isverified){
                return res.json({
                    error : "Verify mail to Login"
                })
            }
            if (bcrypt.compareSync(password, userData.password)){
                const token = jwt.sign({email : userData.email},process.env.JWT_KEY)
                res.json({
                    token : token,
                    data : {
                        userid : userData.userid,
                        name : userData.name,
                        imageUrl : userData.imageUrl,
                        email : userData.email
                    }
                })
            }else{
                res.json({
                    error : "Username (or) Password is Wrong"
                })
            }
        })
        .catch(err =>{
            console.log(err)
            res.json({
                error : err.message
            })
        })
})

router.get("/verify",(req, res)=>{
    const email = req.query.hash
    console.log(email)
    User.findOne({
        where : {hashedEmail : email}
    }).then(data =>{
        data.update({
            isverified : true
        }).then(result=>{
            res.send("<h2>Successfully verified your email.You can login now.</h2><br><a href='http://localhost:4200/login'>Go to Login page</a>")
        }).catch(err =>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
        res.send(err)
    })
    
})

router.post("/reset", (req, res)=> {
    const email = req.body.email
    crypto.randomBytes(32,(err, buffer)=> {
        if (err){
            console.log(err)
        }
        const token = buffer.toString("hex");
        User.findOne({
            where : {email : email}
        }).then(data => {
            if (!data){
                return res.json({
                    error : "No user Found"
                })
            }
            data.update({
                resetToken : token
            }).then(result=> {
                const link = `http://localhost:4200/resetpassword/${token}`
                const mailOption = {
                    to : email,
                    subject : "Reset Password - Regarding",
                    html : "Hello,<br> Please click on the link below to reset your password<br><a href="+link+">Click here</a>"
                    }
                transport.sendMail(mailOption, (err, response)=> {
                    if (err) {
                        console.log(err)
                    }else{
                        console.log(response)
                    }
                })
                res.json({
                    data : "ok"
                })
            })
        }).catch(err =>{
            res.json({
                error : err
            })
        })
    })
    
})

router.post("/resetpassword",(req, res)=> {
    const Password = req.body.password
    const hash = bcrypt.hashSync(Password,10);
    const token = req.body.token
    User.findOne({
        where : {
            resetToken : token
        }
    }).then(data=> {
        console.log(data)
        data.update({
            password : hash
        }).then(result=> {
            res.json({
                msg : "success"
            })
        }).catch(err =>{
            res.json({
                error : err
            })
        })
    }).catch(err=>{
        res.json({
            error : err
        })
    })
})


module.exports = router;
