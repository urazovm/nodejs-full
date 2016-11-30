const PoliceData = require('../models/PoliceData');
const RequestsData = require('../models/RequestsData');
exports.handle = (socket) => {
    socket.on('join', (data) => { //Listen to any join event from connected users
        socket.join(data.userId); //User joins a unique room/channel that's named after the userId
        console.log("User joined room: " + data.userId);
    });
    socket.on('disconnect', () => {
        console.log('Socket disconnected ', socket.id);
    });

    //Listen to a 'request-for-help' event from connected citizens
    socket.on('request-for-help', (eventData) => {
        console.log('have request ', eventData)
        /*
         eventData contains userId and location
         1. First save the request details inside a table requestsData
         2. AFTER saving, fetch nearby cops from citizen’s location
         3. Fire a request-for-help event to each of the cop’s room
         */

        const requestTime = new Date(); //Time of the request

        const ObjectID = require('mongodb').ObjectID;
        const requestId = new ObjectID; //Generate unique ID for the request

        //1. First save the request details inside a table requestsData.
        //Convert latitude and longitude to [longitude, latitude]
        var location = {
            coordinates: [
                eventData.location.longitude,
                eventData.location.latitude
            ],
            address: eventData.location.address
        };
        const newReq = new RequestsData({
            "_id": requestId,
            "requestTime": requestTime,
            "location": location,
            "citizenId": eventData.citizenId,
            "status": 'waitting'
        });
        newReq.save((err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log('new req saved ', result)
                eventData.requestId = requestId;
                //3. After fetching nearest cops, fire a 'request-for-help' event to each of them
                PoliceData.fetchNearestCops(location.coordinates, (results) => {
                    eventData.requestId = requestId;
                    //3. After fetching nearest cops, fire a 'request-for-help' event to each of them
                    for (var i = 0; i < results.length; i++) {
                        socket.in(results[i].userId).emit('request-for-help', eventData);
                    }
                });
            }
        })
    });

    socket.on('request-accepted', (eventData) => {
        const ObjectID = require('mongodb').ObjectID;
        const requestId = new ObjectID(eventData.requestDetails.requestId)
        RequestsData.updateRequest(requestId, eventData.copDetails.copId, 'engaged', (results) => {
            socket.in(eventData.requestDetails.citizenId).emit('request-accepted', eventData.copDetails);
        })
    })

}