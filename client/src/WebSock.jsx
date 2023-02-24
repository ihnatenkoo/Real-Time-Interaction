import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { io } from 'socket.io-client';
const socket = io('ws://localhost:3001');

const WebSock = () => {
	const [messages, setMessages] = useState([]);
	const [messageInputValue, setMessageInputValue] = useState('');
	const [username, setUsername] = useState('');
	const [room, setRoom] = useState('');
	const [connected, setConnected] = useState(false);

	const connect = () => {
		socket.emit('connected', {
			event: 'connected',
			username,
			id: Date.now(),
			room,
		});
		setConnected(true);
	};

	useEffect(() => {
		socket.on('connected', (message) => {
			setMessages((prev) => [message, ...prev]);
		});

		socket.on('receive_message', (message) => {
			setMessages((prev) => [message, ...prev]);
		});
	}, [socket]);

	const onSendMessage = async () => {
		const msg = {
			username,
			room,
			message: messageInputValue,
			id: Date.now(),
		};
		socket.emit('send_message', msg);
		setMessageInputValue('');
	};

	if (!connected) {
		return (
			<Form className='mt-5 mb-5'>
				<Form.Group className='mb-3'>
					<Form.Label>Enter room</Form.Label>
					<Form.Control
						value={room}
						onChange={(e) => setRoom(e.target.value)}
						type='text'
						placeholder='Room...'
					/>
				</Form.Group>
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
						m.event === 'connected' ? (
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
