import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import Autocomplete from './Autocomplete';
import EventDetailsModal from './EventDetailsModal';


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
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    
    useEffect(() => {
        const fetchParks = async () => {
            try {
                const parksResponse = await axios.get('http://127.0.0.1:5555/api/parks');
                setParks(parksResponse.data);
            } catch (error) {
                console.error('Error fetching parks:', error);
            }
        };

        fetchParks();
    }, [showSuccessPopup]);

useEffect(() => {
    async function fetchData() {
        try {
            const parksResponse = await axios.get('http://127.0.0.1:5555/api/parks');
            setParks(parksResponse.data);
            const eventsResponse = await axios.get('http://127.0.0.1:5555/api/events');
                const parksMap = parksResponse.data.reduce((acc, park) => {
                    acc[park.id] = park.name; 
                    return acc;
                }, {});
                const fetchedEvents = eventsResponse.data.map(event => ({
                    ...event,
                    title: event.name,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    parkName: parksMap[event.parkId]
                }));
                setEvents(fetchedEvents);
                setParks(parksResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    
    const handleEventClick = (event) => {
        setSelectedEvent(event); 
        setShowModal(true); 
    };
    
    const handleParkSelect = (park) => {
        setSelectedPark({ name: park.name, id: park.id });
    }; 

    const SuccessPopup = () => {
        return (
            <Modal show={showSuccessPopup} onHide={() => setShowSuccessPopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Park Created Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The park has been created successfully. Please re-enter the newly added park.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowSuccessPopup(false)}>OK</Button>
                </Modal.Footer>
            </Modal>
        );
    };
    const handleParkCreation = async (parkName) => {
        try {
            const response = await axios.post('http://127.0.0.1:5555/api/parks', { name: parkName });
            const newPark = response.data;
            setParks([...parks, newPark]);
            setSelectedPark({ name: newPark.name, id: newPark.id });
            setShowSuccessPopup(true); 
        } catch (error) {
            console.error('Error creating park:', error);
        }
    };
    
    const onEventDrop = async ({ event, start, end }) => {
        const updatedEventData = {
            start: start.toISOString(),
            end: end.toISOString(),
        };
    
        try {
            const response = await axios.patch(`http://127.0.0.1:5555/api/events/update/${event.id}`, updatedEventData);
            if (response.status === 200) {
                const updatedEvents = events.map(evt => 
                    evt.id === event.id ? { ...evt, start, end } : evt
                );
                setEvents(updatedEvents);
                alert('Event updated successfully');
            } else {
                alert('Failed to update the event. Please try again.');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update the event. Please try again.');
        }
    };
    
      
    
    const handleSignUp = async (eventId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          alert('User not logged in');
          return;
        }
        try {
          // Post request to sign up for the event using userId and eventId
          await axios.post('http://127.0.0.1:5555/api/events/signup', { userId, eventId });
          alert('Signed up successfully!');
        } catch (error) {
          console.error('Signup error:', error);
          alert('Failed to sign up for the event');
        }
        setShowModal(false);
      };
      
    const onSelectSlot = ({ start, end }) => {
        const adjustedEnd = new Date(end);
        adjustedEnd.setDate(adjustedEnd.getDate() - 1);

        setCurrentEvent({ ...currentEvent, start, end: adjustedEnd });
        setStartDate(start);
        setEndDate(adjustedEnd);
        setModalIsOpen(true);
    };
    
    const handleInvite = async (email) => {
        const eventId = selectedEvent.id;
        await axios.post('/api/events/invite', { eventId, email });
        // Handle response or error
    };
    
    const onEventResize = async ({ event, start, end }) => {
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
                    onSelectEvent={handleEventClick}
                    style={{ height: 500, marginTop: '1rem' }}
                    resizable
                />
            </Container>
            {showModal && selectedEvent && (
                <EventDetailsModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    eventDetails={selectedEvent}
                    onSignUp={handleSignUp}
                    onInvite={handleInvite}
                />
            )}
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
                        onCreateNew={handleParkCreation}
                    />
                    <Modal show={showSuccessPopup} onHide={() => setShowSuccessPopup(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Park Created Successfully</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>The park has been created successfully. Please re-enter the newly added park.</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => setShowSuccessPopup(false)}>OK</Button>
                        </Modal.Footer>
                    </Modal>
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

