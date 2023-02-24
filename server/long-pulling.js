const events = require('events');
const express = require('express');
const cors = require('cors');
const PORT = 5005;

const emitter = new events.EventEmitter();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.get('/get-messages', (req, res) => {
	emitter.once('newMessage', (message) => {
		res.json(message);
	});
});

app.post('/post-messages', (req, res) => {
	const message = req.body;
	emitter.emit('newMessage', message);
	res.sendStatus(200);
});
