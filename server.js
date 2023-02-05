const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const arr = new Map();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  io.on('connection', (socket) => {
    
    socket.on('user-name',(msg)=>{
        arr.set(socket.id,msg)
        io.emit('user-connected',arr.get(socket.id))
    })
    socket.on('chat-msg',(msg)=>{
        
        socket.broadcast.emit('chat-server',msg)
    })

    socket.on('disconnect', (name) => {
       
        // console.log(arr.get(socket.id)+" disconnects");
        io.emit('user-deleted',arr.get(socket.id))
        arr.delete(socket.id)

      });


  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});