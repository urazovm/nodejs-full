const mongoose = require('mongoose');

const policeDataSchema = new mongoose.Schema({
    userId: {type: String, unique: true},
    displayName: {type: String},
    phone: {type: String},
    email: {type: String},
    earnedRatings: {type: Number},
    totalRatings: {type: Number},
    location: {
        'type': {type: String, enum: "Point", default: "Point"},
        coordinates: {type: [Number], default: [0, 0]}
    },
}, {collection: 'policeData'});
policeDataSchema.index({location: '2dsphere'});
const PoliceData = module.exports = mongoose.model('PoliceData', policeDataSchema);


module.exports.fetchCopDetails = (userId, callback) => {
    PoliceData.findOne({userId: userId}).exec((err, results) => {
        if (err) {
            console.log(err);
        } else {
            callback({
                copId: results.userId,
                displayName: results.displayName,
                phone: results.phone,
                location: results.location
            })
        }
    })
}

module.exports.fetchNearestCops = (coordinates, callback) => {
    PoliceData.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: coordinates
                },
                $maxDistance: 2000
            }
        }
    }).exec(function (err, results) {
        if (err) {
            console.log(err)
        } else {
            callback(results);
        }
    });
}
