const mongoose = require('mongoose');

const requestsDataSchema = new mongoose.Schema({
    _id: {type: String},
    requestTime: {type: String},
    location: {
        'type': {type: String, enum: "Point", default: "Point"},
        coordinates: {type: [Number], default: [0, 0]}
    },
    citizenId: {type: String},
    status: {type: String}
}, {collection: 'requestsData'});
const RD = module.exports  =  mongoose.model('RequestsData', requestsDataSchema);
module.exports.updateRequest = (requestId, copId, status, callback) => {
    RD.update({
        "_id": requestId
    }, {
        $set: {
            "status": status,
            "copId": copId
        }
    }, (err, results) => {
        if(err) {
            console.log(err);
        } else {
            console.log("issue updated ", results)
            callback("Issue updated")
        }
    })
}


