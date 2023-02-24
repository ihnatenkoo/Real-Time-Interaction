import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

const EventSourcing = () => {
	const [messages, setMessages] = useState([]);
	const [messageInputValue, setMessageInputValue] = useState('');

	useEffect(() => {
		subscribe();
	}, []);

	const subscribe = async () => {
		const eventSource = new EventSource('http://localhost:5005/connect');
		eventSource.onmessage = (event) => {
			const message = JSON.parse(event.data);
			setMessages((prev) => [message, ...prev]);
		};
	};

	const onChangeMessageInput = (e) => {
		setMessageInputValue(e.target.value);
	};

	const onSendMessage = async () => {
		await axios.post('http://localhost:5005/post-messages', {
			message: messageInputValue,
			id: Date.now(),
		});
		setMessageInputValue('');
	};

	return (
		<>
			<Form className='mt-5 mb-5'>
				<Form.Group className='mb-3' controlId='formBasicEmail'>
					<Form.Label>Enter a message</Form.Label>
					<Form.Control
						value={messageInputValue}
						onChange={onChangeMessageInput}
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
					{messages.map((m) => (
						<ListGroup.Item key={m.id}>{m.message}</ListGroup.Item>
					))}
				</ListGroup>
			</section>
		</>
	);
};

export default EventSourcing;
