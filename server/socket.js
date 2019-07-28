"use strict";

//======================================================================================================================
// socket-io comms
//======================================================================================================================
    const
//----------------------------------------------------------------------------------------------------------------------
    auth = require('./auth');

//----------------------------------------------------------------------------------------------------------------------
    let
//----------------------------------------------------------------------------------------------------------------------
    io = null;

//----------------------------------------------------------------------------------------------------------------------
// Public methods
//----------------------------------------------------------------------------------------------------------------------
// Startup socket io server
//----------------------------------------------------------------------------------------------------------------------
function start(server) {
    io = require('socket.io')(server, {path: '/socket.io'});

    // Incoming updates
    io.use(function(socket, next){
            auth.authorizeSocket(socket, next);
        })
        .on('connection', (socket) => {
            console.log('SOCKET CLIENT CONNECTED');

            socket.on('event', event => {
                console.log('SOCKET EVENT');
                console.log(event);
                socket.broadcast.emit('event', event);
            });

            socket.on('disconnect', () => {
                console.log('SOCKET CLIENT DISCONNECTED');
            })
        });
}

//======================================================================================================================
// Exports
//======================================================================================================================
module.exports = {
    start: start
};
