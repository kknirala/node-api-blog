const constant = require('../constant/constant.js');
let userAPiResponse =(status,message,data)=>{
    const {role, name, email , phone, qualification, areaofInteres, picUrl, userName} = data;
    return {
        status: status,
        message : message,
        data : {role: constant.roles[role], name, email , phone, qualification, areaofInteres, picUrl, userName}
    }
}
let userAPiRequest =(data)=>{
    const {name, email, password , phone, qualification, areaofInteres, picUrl, userName} = data;
    return {
        role:'EU',
        name,
        email: email.toLowerCase(),
        phone,
        qualification,
        areaofInteres,
        picUrl,
        userName,
        password
    }
}

let guserAPiRequest =(data)=>{
    const {name, email, phoneCode, phone, stories, createdBy} = data;
    return {
        name: name || '',
        email,
        phoneCode: phoneCode || '', 
        phone: phone || '',
        createdBy: createdBy || 'guest',
        stories: stories || []
    }
}

// let adminUserAPiRes =(data)=>{
//     const {role, name, email , phone, qualification, areaofInteres, picUrl, userName} = data;
//     return {
//         data : {name, email , phone, qualification, areaofInteres, picUrl, userName}
//     }
// }

let gcFeedAPI = (data) =>{
    let {
        title,
        desc,
        html,
        published,
        titlPic,
        isDeleted,
        createdBy,
        modifiedBy
    } = data;
    return {
        title,
        desc,
        html,
        published,
        titlPic,
        isDeleted: false,
        createdBy: createdBy || 'guest',
        modifiedBy: null
    }
}

module.exports={userAPiResponse, userAPiRequest, gcFeedAPI, guserAPiRequest};
