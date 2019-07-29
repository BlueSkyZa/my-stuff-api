"use strict";

//======================================================================================================================
// Authentication and authorisation
//======================================================================================================================
    const
//----------------------------------------------------------------------------------------------------------------------
    promise = require('bluebird'),
    jwt = require('json-web-token'),
    user = require('./data/user'),

    key = 'eat your veggies';

//======================================================================================================================
// Private methods
//======================================================================================================================
// Create JSWT
//----------------------------------------------------------------------------------------------------------------------
function encodeToken(data) {
    return new promise((resolve, reject) => {
        const
            now = new Date(),
            payload = {
                created: now.toISOString(),
                expires: new Date(now.setHours(now.getHours() + 8)).toISOString(),
                service: 'My Stuff',
                data: data
            };

        jwt.encode(key, payload, (error, token) => {
            if (error) reject(error);
            else resolve({token, data: payload.data});
        });
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Decode JSWT
//----------------------------------------------------------------------------------------------------------------------
function decodeToken(token) {
    return new promise((resolve, reject) => {
        jwt.decode(key, token, function (error, payload) {
            if (error) return reject(error);

            const
                expires = new Date(payload.expires || null),
                now = new Date();

            if (now > expires) return reject({expired: true, message: 'Your session has expired', code: 401});
            else return resolve({token: token, data: payload.data});
        });
    });
}

//======================================================================================================================
// Public methods
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

    encodeToken(result.data)
        .then(result => {
            res.json({success: true, data: {token: result.token, user: result.data}})
        })
        .catch(error => {
            res.status(500).json(error)
        });
}

//----------------------------------------------------------------------------------------------------------------------
// Authorise provided token
//----------------------------------------------------------------------------------------------------------------------
function authorise(req, res, next) {
    let token = req.headers.authorization;
    if (token) token = token.replace(/bearer/ig, '').trim();
    if (!token) return res.status(403).json({success: false, message: 'Access denied'});

    decodeToken(token)
        .then(result => {
            req._authorization = result.data;
            next();
        })
        .catch(error => res.status(500).json(error));
}

//----------------------------------------------------------------------------------------------------------------------
// Authorise provided token over socket
//----------------------------------------------------------------------------------------------------------------------
function authorizeSocket(socket, next) {
    let token = socket.handshake.query.authorization || socket.handshake.headers.authorization;
    if (token) token = token.replace(/bearer/ig, '').trim();
    if (!token) return res.status(403).json({success: false, message: 'Access denied'});

    decodeToken(token)
        .then(result => {
            socket._authorization = result.data;
            next();
        })
        .catch(error => next({message: error.message}));
}

//----------------------------------------------------------------------------------------------------------------------
// check if user has write access
//----------------------------------------------------------------------------------------------------------------------
function write(req, res, next) {
    if (req._authorization.role === 'write' || req._authorization.role === 'admin') next();
    else res.status(403).json({success: false, message: 'Access denied'});
}

//----------------------------------------------------------------------------------------------------------------------
// check if user has admin access
//----------------------------------------------------------------------------------------------------------------------
function admin(req, res, next) {
    if (req._authorization.role === 'admin') next();
    else res.status(403).json({success: false, message: 'Access denied'});
}

//======================================================================================================================
// Exports
//======================================================================================================================
module.exports = {
    authenticate: authenticate,
    authorise: authorise,
    authorizeSocket: authorizeSocket,

    write: write,
    admin: admin
};

//----------------------------------------------------------------------------------------------------------------------
