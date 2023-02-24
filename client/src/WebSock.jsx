import { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

const WebSock = () => {
	const [messages, setMessages] = useState([]);
	const [messageInputValue, setMessageInputValue] = useState('');
	const [connected, setConnected] = useState(false);
	const [username, setUsername] = useState('');
	const socket = useRef();

	const connect = () => {
		socket.current = new WebSocket('ws://localhost:5000');
		console.log('Success connection');

		socket.current.onopen = () => {
			setConnected(true);
			const msg = {
				event: 'connection',
				username,
				id: Date.now(),
			};
			socket.current.send(JSON.stringify(msg));
		};

		socket.current.onmessage = (event) => {
			const msg = JSON.parse(event.data);
			setMessages((prev) => [msg, ...prev]);
		};

		socket.current.onclose = () => {
			setConnected(false);
			console.log('Socket connection close');
		};

		socket.current.onerror = () => {
			setConnected(false);
			console.log('Socket error');
		};
	};

	const onSendMessage = async () => {
		const msg = {
			event: 'message',
			username,
			message: messageInputValue,
			id: Date.now(),
		};
		socket.current.send(JSON.stringify(msg));
		setMessageInputValue('');
	};

	if (!connected) {
		return (
			<Form className='mt-5 mb-5'>
				<Form.Group className='mb-3'>
					<Form.Label>Enter your name</Form.Label>
					<Form.Control
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						type='text'
						placeholder='Your name...'
					/>
				</Form.Group>

				<Button variant='primary' onClick={connect}>
					Enter
				</Button>
			</Form>
		);
	}

	return (
		<>
			<Form className='mt-5 mb-5'>
				<Form.Group className='mb-3' controlId='formBasicEmail'>
					<Form.Label>Enter a message</Form.Label>
					<Form.Control
						value={messageInputValue}
						onChange={(e) => setMessageInputValue(e.target.value)}
						type='text'
						placeholder='Message...'
					/>
				</Form.Group>

				<Button variant='primary' onClick={onSendMessage}>
					Send
				</Button>
			</Form>
			<section>
				<ListGroup>
					{messages.map((m) =>
						m.event === 'connection' ? (
							<ListGroup.Item
								style={{ color: 'green', fontWeight: '700' }}
								key={m.id}
							>
								{m.username} connected
							</ListGroup.Item>
						) : (
							<ListGroup.Item key={m.id}>
								{m.username} : {m.message}
							</ListGroup.Item>
						)
					)}
				</ListGroup>
			</section>
		</>
	);
};

export default WebSock;
