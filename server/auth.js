"use strict";

//======================================================================================================================
// Authentication and authorisation
//======================================================================================================================
    const
//----------------------------------------------------------------------------------------------------------------------
    user = require('./data/user');

//======================================================================================================================
// Authenticate user name and password
//----------------------------------------------------------------------------------------------------------------------
function authenticate(req, res) {
    if (!req.headers.authorization) return res.status(400).json({success: false, message: 'No authorisation'});

    let data = req.headers.authorization.replace(/basic/ig, '').trim();
    data = Buffer.from(data, 'base64').toString();
    data = data.split(':');

    console.log('AUTHENTICATE USER: ' + data[0]);

    const result = user.authenticate(data[0], data[1]);

    if (result.success) res.json({success: true, data: result.data });
    else res.status(401).json({success: false, message: result.message});
}

//----------------------------------------------------------------------------------------------------------------------
// Authorise provided token
//----------------------------------------------------------------------------------------------------------------------
function authorise(req, res, next) {
    // TODO: check for and validate web token
    next();
}

//----------------------------------------------------------------------------------------------------------------------
// Authorise provided token over socket
//----------------------------------------------------------------------------------------------------------------------
function authorizeSocket(socket, next) {
    next();
}

//======================================================================================================================
// Exports
//======================================================================================================================
module.exports = {
    authenticate: authenticate,
    authorise: authorise,
    authorizeSocket: authorizeSocket
};

//----------------------------------------------------------------------------------------------------------------------
