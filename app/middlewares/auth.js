const db = require("../models").get(process.env.NODE_ENV, 'dbBlog');
const User = db.user;

let auth =(req,res,next)=>{
    // read token for req.header
    console.log('token:- ', req.headers.token);
    if(req.headers.token){
        let token = req.headers.token;
        // console.log('inside token-->', token)
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
    else return false;
}

module.exports={auth};
