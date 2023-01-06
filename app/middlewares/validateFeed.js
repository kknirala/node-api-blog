const db = require("../models");

let validateFeed = async(modelName, feedId)=>{
    let isFound = false;
    let feed = db.getModel(modelName);
    let result = await feed.findOne({ feedId });
    if(result) isFound = true;
    return isFound;
}

module.exports={validateFeed};
