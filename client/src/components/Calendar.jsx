import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import Autocomplete from './Autocomplete';


import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function MyCalendar() {
    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({title: '', start: '', end: '', description: ''});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [parks, setParks] = useState([]);
    const [selectedPark, setSelectedPark] = useState({ name: '', id: null });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5555/api/events');
                const fetchedEvents = response.data.map(event => ({
                    ...event,
                    title: event.name, // Assuming 'name' is the field from your backend
                    start: new Date(event.start),
                    end: new Date(event.end)
                }));
                setEvents(fetchedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
    
        fetchEvents();

        const fetchParks = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5555/api/parks');
                setParks(response.data);
            } catch (error) {
                console.error('Error fetching parks:', error);
            }
        };

        fetchParks();
    }, []);
        
    const handleParkSelect = (park) => {
        setSelectedPark({ name: park.name, id: park.id });
    }; 

    const onEventDrop = async ({ event, start, end }) => {
        const updatedEvent = { ...event, start, end };
      
        try {
          const response = await axios.patch(`http://127.0.0.1:5555/api/events/${event.id}`, {
            
            start: start.toISOString(),
            end: end.toISOString(),
          });
          if (response.status === 200) {
            const updatedEvents = events.map(evt => evt.id === event.id ? updatedEvent : evt);
            setEvents(updatedEvents);
            alert('Event updated successfully');
          }
        } catch (error) {
            console.error('Error updating event:', error);
            console.log(error.response); // This will give you more insight into the error
            alert('Failed to update the event');
        }
      };

      const onSelectSlot = ({ start, end }) => {
        // Adjust the end date for display if needed
        const adjustedEnd = new Date(end);
        adjustedEnd.setDate(adjustedEnd.getDate() - 1);
    
        // Update the state with the adjusted dates
        setCurrentEvent({ ...currentEvent, start, end: adjustedEnd });
        setStartDate(start);
        setEndDate(adjustedEnd);
        setModalIsOpen(true);
    };
    

    const onEventResize = async ({ event, start, end }) => {
        // This can call the same function as onEventDrop since the operation is similar
        onEventDrop({ event, start, end });
      };
      
    const handleCreateEvent = async () => {
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        startDateTime.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]));
        endDateTime.setHours(parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1]));
    
        
        if (!selectedPark.id) {
            alert('Please select a valid park.');
            return;
        }
    
        
        const postData = {
            name: currentEvent.title, 
            description: currentEvent.description, 
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            parkId: selectedPark.id, 
            park_name: selectedPark.name, 
        };
    
        console.log("Attempting to send data:", postData);
    
        try {
            const response = await axios.post('http://127.0.0.1:5555/api/events', postData);
            const newEvent = {
                ...currentEvent,
                id: response.data.event.id,
                start: startDateTime,
                end: endDateTime,
            };
            setEvents([...events, newEvent]);
            setModalIsOpen(false);
            alert('Event created successfully');
        } catch (error) {
            console.error('Error creating event:', error.response?.data?.message || 'An error occurred');
        }
    };
    
    

    return (
        <>
            <Container fluid>
                <DnDCalendar
                    selectable
                    localizer={localizer}
                    events={events.map(event => ({
                        ...event,
                        start: new Date(event.start),
                        end: new Date(event.end)
                    }))}
                    onEventDrop={onEventDrop}
                    onEventResize={onEventResize}
                    onSelectSlot={onSelectSlot}
                    style={{ height: 500, marginTop: '1rem' }}
                    resizable
                />
            </Container>
            <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>New Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Event Name</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Enter event name"
                        value={currentEvent.title}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                        />
                    </Form.Group>

                    <Autocomplete
                        suggestions={parks}
                        onSelected={(selectedPark) => setSelectedPark(selectedPark)}
                    />

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Event description"
                        value={currentEvent.description}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                        />
                    </Form.Group>

                    <Row>
                        <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Start Date and Time</Form.Label>
                            <Form.Control
                            type="date"
                            value={moment(startDate).format('YYYY-MM-DD')}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                            />
                            <Form.Control
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            />
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>End Date and Time</Form.Label>
                            <Form.Control
                            type="date"
                            value={moment(endDate).format('YYYY-MM-DD')}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                            />
                            <Form.Control
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            />
                        </Form.Group>
                        </Col>
                    </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalIsOpen(false)}>
                    Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateEvent}>
                    Save Changes
                    </Button>
                </Modal.Footer>
                </Modal>
        </>
    );
}

export default MyCalendar;