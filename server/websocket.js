const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: 'http://127.0.0.1:5174',
		methods: ['GET', 'POST'],
	},
});

io.on('connection', (socket) => {
	socket.on('connected', (data) => {
		socket.join(data.room);
		io.in(data.room).emit('connected', data);
	});

	socket.on('send_message', (data) => {
		io.in(data.room).emit('receive_message', data);
	});
});

server.listen(3001, () => {
	console.log('Server started on port 3001');
});
