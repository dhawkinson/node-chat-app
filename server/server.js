'use strict';

// built-in modules
const path       = require('path');
const http       = require('http');

// node_modules
const express    = require('express');
const socketIO   = require('socket.io');

// local modules
const publicPath = path.join(__dirname, '/../public');

// environment variables
const port       = process.env.PORT || 3000;


const app        = express();
const server     = http.createServer(app);
const io         = socketIO(server);        //  web socket server

app.use(express.static(publicPath));

//  listen for an event (in this case a connection)
io.on('connection', (socket) => {
    console.log('New user connected');
    
    socket.on('disconnect', () => {
        console.log('Also disconnected from server');
    });
});

server.listen(port, () => {
    console.log(`Server is started on port ${port}`);
});
