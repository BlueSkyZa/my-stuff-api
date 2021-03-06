"use strict";

//======================================================================================================================
// User routes
//======================================================================================================================
    const
//----------------------------------------------------------------------------------------------------------------------
    express = require('express'),
    auth = require('../auth'),
    user = require('../data/user'),
    router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Routes
//----------------------------------------------------------------------------------------------------------------------
router.post("/", auth.authorise, auth.admin, user.post);
router.put("/:id", auth.authorise, auth.admin, user.put);
router.get("/", auth.authorise, auth.admin, user.get);
router.delete("/:id", auth.authorise, auth.admin, user.del);

//======================================================================================================================
// Exports
//======================================================================================================================
module.exports = router;
