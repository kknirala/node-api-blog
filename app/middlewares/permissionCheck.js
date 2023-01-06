const db = require("../models").get(process.env.NODE_ENV, 'dbBlog');
const User = db.user;

let permissionCheck =(req,res,next)=>{
    // console.log('token:- ', req.headers.token);

    // find user by token.
    if(req.headers.token){
        const token = req.headers.token
        // let id =req.cookies.uid;
        User.findByToken(token,(err,user)=>{
            // console.log(user);
            if(err) throw err;
            if(!user) return res.json({
                error :true
            });
            if(user && user.role == 'A')
                next();
            else return res.json({
                error :"user is not authorised"
            });
        })
    }
    else {
        return false;
    }
    // next();
}

module.exports={permissionCheck};

// if(req.cookies.auth){
//     let token =req.cookies.auth;
//     User.findByToken(token,(err,user)=>{
//         if(err) throw err;
//         if(!user) return res.json({
//             error :true
//         });
//         if(user && user.utype == 'A')
//         next();

//     })
// }
// else next();

