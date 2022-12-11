const config={
    production :{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default : {
        SECRET: 'hkdshkjfkey',
        DATABASE: 'mmongodb://localhost:27017/db_blog'
    }
}


exports.get = function get(env){
    return config[env] || config.default
}