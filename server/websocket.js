const ws = require('ws');

const wss = new ws.Server({ port: 5000 }, () =>
	console.log('Server started on port 5000')
);

wss.on('connection', (ws) => {
	ws.on('message', (msg) => {
		message = JSON.parse(msg);
		switch (message.event) {
			case 'connection':
				broadcastMessage(message);
				break;
			case 'message':
				broadcastMessage(message);
				break;
		}
	});
});

const broadcastMessage = () => {
	wss.clients.forEach((client) => {
		client.send(JSON.stringify(message));
	});
};
