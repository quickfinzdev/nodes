const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let broadcaster;

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('watcher', () => {
    if (broadcaster) {
      io.to(broadcaster).emit('watcher', socket.id);
    }
  });

  socket.on('offer', (id, message) => {
    io.to(id).emit('offer', socket.id, message);
  });

  socket.on('answer', (id, message) => {
    io.to(id).emit('answer', socket.id, message);
  });

  socket.on('candidate', (id, message) => {
    io.to(id).emit('candidate', socket.id, message);
  });

  socket.on('broadcaster', () => {
    broadcaster = socket.id;
    socket.broadcast.emit('broadcaster');
  });

  socket.on('disconnect', () => {
    io.emit('disconnectPeer', socket.id);
  });
});

server.listen(3000, () => console.log('Signaling server running on port 3000'));