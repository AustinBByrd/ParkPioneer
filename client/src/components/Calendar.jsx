import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
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

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5555/api/events');
                // Assuming the backend returns an array of events
                setEvents(response.data.map(event => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end)
                })));
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);


    const onEventDrop = ({ event, start, end }) => {
        const idx = events.findIndex(evt => evt.id === event.id);
        const updatedEvent = { ...event, start, end };
        const updatedEvents = [...events];
        updatedEvents.splice(idx, 1, updatedEvent);
        setEvents(updatedEvents);
    };

    const onSelectSlot = ({ start, end }) => {
        setCurrentEvent({ start, end });
        setModalIsOpen(true);
    };

    const handleCreateEvent = async () => {
        // Create Date objects from the selected date and time
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
    
        // Parse the time strings and set the hours and minutes
        const [startHours, startMinutes] = startTime.split(':');
        const [endHours, endMinutes] = endTime.split(':');
        startDateTime.setHours(startHours, startMinutes);
        endDateTime.setHours(endHours, endMinutes);
    
        try {
            const postData = {
                name: currentEvent.title,
                description: currentEvent.description,
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString(),
                park_id: currentEvent.parkId,
            };
            const response = await axios.post('http://127.0.0.1:5555/api/events', postData);
            const newEvent = {
                ...currentEvent,
                id: events.length, // This should ideally come from the response, not the length of the events array
                start: startDateTime,
                end: endDateTime
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
            <DnDCalendar
                selectable
                localizer={localizer}
                events={events}
                onEventDrop={onEventDrop}
                onEventResize={({ event, start, end }) => onEventDrop({ event, start, end })}
                onSelectSlot={onSelectSlot}
                style={{ height: 500 }}
                resizable
            />
            {modalIsOpen && (
                <div style={{ position: 'fixed', top: '20%', left: '30%', backgroundColor: 'white', padding: 20, zIndex: 100 }}>
                    <h2>New Event</h2>
                    <input
                        placeholder="Event Title"
                        value={currentEvent.title}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Event Description"
                        value={currentEvent.description}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                        style={{ marginTop: 10 }}
                    />
                    <input
                        placeholder="Park ID"
                        type="number" // Assuming Park ID is a number
                        value={currentEvent.parkId || ''}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, parkId: e.target.value })}
                        style={{ marginTop: 10 }}
                    />
                    <input
                        type="date"
                        value={moment(startDate).format('YYYY-MM-DD')}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                        style={{ marginTop: 10 }}
                    />
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        style={{ marginTop: 10 }}
                    />
                    <input
                        type="date"
                        value={moment(endDate).format('YYYY-MM-DD')}
                        onChange={(e) => setEndDate(new Date(e.target.value))}
                        style={{ marginTop: 10 }}
                    />
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        style={{ marginTop: 10 }}
                    />
                    <button onClick={handleCreateEvent} style={{ marginTop: 10 }}>Create Event</button>
                    <button onClick={() => setModalIsOpen(false)} style={{ marginTop: 10 }}>Cancel</button>
                </div>
            )}
        </>
    );
}

export default MyCalendar;