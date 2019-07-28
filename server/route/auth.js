"use strict";

//======================================================================================================================
// Auth routes
//======================================================================================================================
    const
//----------------------------------------------------------------------------------------------------------------------
    express = require('express'),
    auth = require('../auth'),
    router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Routes
//----------------------------------------------------------------------------------------------------------------------
router.get("/authenticate", auth.authenticate);

//======================================================================================================================
// Exports
//======================================================================================================================
module.exports = router;
