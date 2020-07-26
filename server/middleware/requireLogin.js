const jwt = require("jsonwebtoken");
const User = require("../database").user;

module.exports = (req, res, next)=> {
    const { authorization } = req.headers;
    console.log(authorization)
    if (!authorization){
        res.json({
            error : "Please Login to Continue"
        })
    }
    const token = authorization.replace("Bearer ","");
    jwt.verify(token,"cndjb",(err, payload)=> {
        if (err) {
            res.json({
                error : "Something Wrong! Please try again"
            })
        }
        console.log(payload)
        const {email} = payload;
        User.findOne({where : { email : email}})
            .then(data =>{
                req.userData = data
                next()
            })
            
    })

}