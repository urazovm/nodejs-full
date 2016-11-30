const PoliceData = require('../models/PoliceData');
const RequestsData = require('../models/RequestsData');

exports.getCops = (req, res) => {
    console.log("get cops");
    let latitude = Number(req.query.lat),
        longitude = Number(req.query.lng);
    PoliceData.fetchNearestCops([longitude, latitude], function (results) {
        res.json({
            cops: results
        });
    });
};

exports.getCitizen = (req, res) => {
    res.render('uber/citizen', {
        userId: req.query.userId
    });
};
exports.getCop = (req, res) => {
    res.render('uber/cops', {
        userId: req.query.userId
    })
};

exports.getCopsInfo = (req, res) => {
    const userId = req.query.userId;
    PoliceData.findOne({userId: userId}).exec((err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.json({copDetails: result})
        }
    })
};





