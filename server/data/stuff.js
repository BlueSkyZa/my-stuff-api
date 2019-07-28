"use strict";

//======================================================================================================================
// Staff data
//======================================================================================================================
    const
//----------------------------------------------------------------------------------------------------------------------
    data = [
        { id: '0', name: 'My Stuff', parentId: null},
        { id: '1', name: 'Fruit', parentId: '0'},
        { id: '2', name: 'Apple', parentId: '1' },
        { id: '3', name: 'Banana', parentId: '1' },
        { id: '4', name: 'Fruit loops', parentId: '1' },
        { id: '5', name: 'Vegetables', parentId: '0'},
        { id: '6', name: 'Green', parentId: '5' },
        { id: '7', name: 'Broccoli', parentId: '6' },
        { id: '8', name: 'Brussel sprouts', parentId: '6' },
        { id: '9', name: 'Orange', parentId: '5'},
        { id: '10', name: 'Pumpkins', parentId: '9'},
        { id: '11', name: 'Carrots', parentId: '9'},
    ];

//----------------------------------------------------------------------------------------------------------------------
// Create new record
//----------------------------------------------------------------------------------------------------------------------
function post(req, res) {
    data.push(reg.body);
    res.json({success: true});
}

//----------------------------------------------------------------------------------------------------------------------
// Update existing record
//----------------------------------------------------------------------------------------------------------------------
function put(req, res) {
    if (!req.query.id) return res.status(400).json({success: false, message: 'Id not provided'});
    if (!req.body.name) return res.status(400).json({success: false, message: 'Data not provided'});

    const item = data.find(item => item.id === req.query.id);
    if (!item) return res.status(410).json({success: false, message: 'item not found'});

    item.parentId = req.body.parentId;
    item.name = req.body.name;
    res.json({success: true});
}

//----------------------------------------------------------------------------------------------------------------------
// Get records
//----------------------------------------------------------------------------------------------------------------------
function get(req, res) {
    res.json({success: true, data: data});
}

//----------------------------------------------------------------------------------------------------------------------
// Delete record
//----------------------------------------------------------------------------------------------------------------------
function del(req, res) {
    if (!req.query.id) return res.status(400).json({success: false, message: 'Id not provided'});

    const index = data.findIndex(item => item.id === req.query.id);
    if (index === -1) return res.status(410).json({success: false, message: 'item not found'});

    res.json({success: true});
}

//======================================================================================================================
// Exports
//======================================================================================================================
module.exports = {
    post: post,
    put: put,
    get: get,
    del: del
};

//----------------------------------------------------------------------------------------------------------------------
