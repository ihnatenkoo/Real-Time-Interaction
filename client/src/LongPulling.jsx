import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

const LongPulling = () => {
	const [messages, setMessages] = useState([]);
	const [messageInputValue, setMessageInputValue] = useState('');

	useEffect(() => {
		subscribe();
	}, []);

	const subscribe = async () => {
		try {
			const { data } = await axios.get('http://localhost:5005/get-messages', {
				headers: { 'Cache-Control': 'no-cache, no-transform' },
			});
			setMessages((prev) => [data, ...prev]);
			await subscribe();
		} catch (error) {
			setTimeout(() => {
				subscribe();
			}, 500);
		}
	};

	const onChangeMessageInput = (e) => {
		setMessageInputValue(e.target.value);
	};

	const onSendMessage = async () => {
		await axios.post(
			'http://localhost:5005/post-messages',
			{
				message: messageInputValue,
			},
			{ headers: { 'Cache-Control': 'no-cache, no-transform' } }
		);
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
						<ListGroup.Item key={m.message}>{m.message}</ListGroup.Item>
					))}
				</ListGroup>
			</section>
		</>
	);
};

export default LongPulling;
