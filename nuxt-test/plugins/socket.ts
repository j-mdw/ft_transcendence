import { io, Socket } from 'socket.io-client'

const socket: Socket = io("http://localhost:4001");
// socket.on('connect', () => {
// 	console.log(`Connected with id: , ${socket.id}`);
// })

socket.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
	  console.log('user disconnected');
	});
  });