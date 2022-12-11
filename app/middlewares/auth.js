const db = require("../models");
const User = db.User;

let auth =(req,res,next)=>{
    if(req.cookies.auth){
        let token =req.cookies.auth;
        User.findByToken(token,(err,user)=>{
            if(err) throw err;
            if(!user) return res.json({
                error :true
            });

            req.token= token;
            req.user=user;
            next();

        })
    }
    else next();

}

module.exports={auth};
