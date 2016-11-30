// Place JavaScript code here...


var socket = io();

//Fetch userId from the data-atribute of the body tag
var userId = document.body.getAttribute("data-userId");

/*Fire a 'join' event and send your userId to the server, to join a room - room-name will be the userId itself!
 */
socket.emit('join', {userId: userId});

//Declare variables, this will be used later
var requestDetails = {};
var copDetails = {};
var map, marker;








//When button is clicked, fire request-for-help and send citizen's userId and location
function requestForHelp() {
    console.log('requesting...')
    socket.emit("request-for-help", requestDetails);
}

function helpCitizen(){
    //Fire a "request-accepted" event/signal and send relevant info back to server
    socket.emit("request-accepted", {
        requestDetails: requestDetails,
        copDetails: copDetails
    });
}
