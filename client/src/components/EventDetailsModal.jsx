import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import moment from 'moment';

const EventDetailsModal = ({ show, onHide, eventDetails, onSignUp, onInvite }) => {
  const [email, setEmail] = useState('');

  const handleInvite = (e) => {
    e.preventDefault();
    onInvite(email);
    setEmail('');
  };

  const formatDateTime = (datetime) => {
    return moment(datetime).format('LLLL');
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{eventDetails.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{eventDetails.description}</p>
        <p>Park: {eventDetails.park_name}</p>
        <p>Start: {formatDateTime(eventDetails.start)}</p>
        <p>End: {formatDateTime(eventDetails.end)}</p>
        <Form onSubmit={handleInvite}>
          <Form.Group>
            <Form.Label>Invite others by email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </Form.Group>
          <Button type="submit">Send Invite</Button>
        </Form>
        <Button variant="primary" onClick={() => onSignUp(eventDetails.id)}>Sign Up for Event</Button>
      </Modal.Body>
    </Modal>
  );
};

export default EventDetailsModal;