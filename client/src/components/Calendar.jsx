import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function MyCalendar() {
    const [events, setEvents] = useState([
        {
            id: 0,
            start: new Date(),
            end: new Date(moment().add(1, "days")),
            title: "Initial Event",
            description: "Initial Description",
            park_id: "Null",
        }
    ]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({title: '', start: null, end: null, description: ''});


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
        try {
            const postData = {
                name: currentEvent.title,
                description: currentEvent.description,
                start: currentEvent.start.toISOString(),
                end: currentEvent.end.toISOString(),
                park_id: currentEvent.parkId,
            };
            const response = await axios.post('http://127.0.0.1:5555/api/events', postData);
            const newEvent = { ...currentEvent, id: events.length };
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
                        onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
                    />
                    <textarea
                        placeholder="Event Description"
                        value={currentEvent.description}
                        onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})}
                        style={{ marginTop: 10 }}
                    />
                    <input
                        placeholder="Park ID"
                        type="text"
                        value={currentEvent.parkId || ''} 
                        onChange={(e) => setCurrentEvent({...currentEvent, parkId: e.target.value})}
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