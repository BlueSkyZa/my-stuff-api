"use strict";

//======================================================================================================================
// My Stuff Service
//======================================================================================================================
    const
//----------------------------------------------------------------------------------------------------------------------
    express = require('express'),
    app = express(),
    http = require('http'),
    bodyParser = require('body-parser'),
    cors = require('cors');

//----------------------------------------------------------------------------------------------------------------------
// Uncaught Errors
//----------------------------------------------------------------------------------------------------------------------
process.on("uncaughtException", error => {
    console.error(error);
});

process.on('unhandledRejection', error => {
    console.error(error);
});

//----------------------------------------------------------------------------------------------------------------------
//  CORS
//----------------------------------------------------------------------------------------------------------------------
app.use(cors());

//----------------------------------------------------------------------------------------------------------------------
// Body Parsers
//----------------------------------------------------------------------------------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//----------------------------------------------------------------------------------------------------------------------
//  Routes
//----------------------------------------------------------------------------------------------------------------------
app.use('*/api/auth', require('./server/route/auth'));
app.use('*/api/user', require('./server/route/user'));
app.use('*/api/stuff', require('./server/route/stuff'));

//----------------------------------------------------------------------------------------------------------------------
// Port
//----------------------------------------------------------------------------------------------------------------------
const port = process.env.PORT || '9303';
app.set('port', port);

//----------------------------------------------------------------------------------------------------------------------
// Server
//----------------------------------------------------------------------------------------------------------------------
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`LISTENING ${port}`);
    require('./server/socket').start(server);
    if (process.send) process.send('ready');
});

