"use strict";

//======================================================================================================================
// User data
//======================================================================================================================
    const
//----------------------------------------------------------------------------------------------------------------------
    uuid = require('uuid/v1'),

    data = [
        { id: '0', username: 'Mark', password: 'sparky', role: 'admin'},
        { id: '1', username: 'Sandy', password: 'sleepy', role: 'write'},
        { id: '2', username: 'Randy', password: 'rando', role: 'read'}
    ];

//----------------------------------------------------------------------------------------------------------------------
// Create new record
//----------------------------------------------------------------------------------------------------------------------
function post(req, res) {
    if (!req.body.username) return res.status(400).json({success: false, message: 'Username not provided'});
    if (!req.body.password) return res.status(400).json({success: false, message: 'Password not provided'});
    if (!req.body.role) return res.status(400).json({success: false, message: 'Role not provided'});

    console.log('POST USER');
    console.log(req.body);

    req.body.id = uuid();
    data.push(req.body);
    res.json({success: true, data: req.body});
}

//----------------------------------------------------------------------------------------------------------------------
// Update existing record
//----------------------------------------------------------------------------------------------------------------------
function put(req, res) {
    if (!req.body.id) return res.status(400).json({success: false, message: 'Id not provided'});

    const item = data.find(item => item.id === req.params.id);
    if (!item) return res.status(410).json({success: false, message: 'User not found'});

    console.log('PUT USER');
    console.log(req.body);

    if (req.body.username) item.username = req.body.username;
    if (req.body.password) item.password = req.body.password;
    if (req.body.role) item.role = req.body.role;

    res.json({success: true});
}

//----------------------------------------------------------------------------------------------------------------------
// Get record
//----------------------------------------------------------------------------------------------------------------------
function get(req, res) {
    console.log('GET USER: ' + data.length);
    res.json({success: true, data: data.map(user => {
            return {id: user.id, username: user.username, role: user.role};
        })});
}

//----------------------------------------------------------------------------------------------------------------------
// Delete record
//----------------------------------------------------------------------------------------------------------------------
function del(req, res) {
    const index = data.findIndex(item => item.id === req.params.id);
    if (index === -1) return res.status(410).json({success: false, message: 'User not found'});

    data.splice(index, 1);
    console.log('DELETE USER: ' + req.params.id);

    res.json({success: true});
}

//----------------------------------------------------------------------------------------------------------------------
// Delete record
//----------------------------------------------------------------------------------------------------------------------
function authenticate(username, password) {
    username = username.toLowerCase();

    const index = data.findIndex(item => item.username.toLowerCase() === username);
    if (index === -1) return {success: false, message: 'Invalid login'};

    const user = {
        id: data[index].id,
        username: data[index].username,
        role: data[index].role,
    };

    if (data[index].password === password) return {success: true, data: user};
    else return {success: false, message: 'Invalid login'};
}

//======================================================================================================================
// Exports
//======================================================================================================================
module.exports = {
    post: post,
    put: put,
    get: get,
    del: del,

    authenticate : authenticate
};

//----------------------------------------------------------------------------------------------------------------------
