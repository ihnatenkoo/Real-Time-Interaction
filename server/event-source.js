const events = require('events');
const express = require('express');
const cors = require('cors');
const PORT = 5005;

const emitter = new events.EventEmitter();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.get('/connect', (req, res) => {
	res.writeHead(200, {
		Connection: 'keep-alive',
		'Content-type': 'text/event-stream',
		'Cache-Control': 'no-cache',
	});
	emitter.on('newMessage', (message) => {
		res.write(`data: ${JSON.stringify(message)} \n\n`);
	});
});

app.post('/post-messages', (req, res) => {
	const message = req.body;
	emitter.emit('newMessage', message);
	res.sendStatus(200);
});
