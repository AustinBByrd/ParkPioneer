import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import Autocomplete from './Autocomplete'

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
                        type="text"
                        placeholder="Event Name"
                        value={currentEvent.name}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                        style={{ marginBottom: 10, width: "100%" }}
                    />
                    <Autocomplete
                        suggestions={parks}
                        onSelected={handleParkSelect}
                    />
                    <textarea
                        placeholder="Event Description"
                        value={currentEvent.description}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                        style={{ marginTop: 10, width: "100%", minHeight: "100px" }}
                    />
                    <div style={{ marginTop: 10 }}>
                        Start Date and Time:
                        <input
                            type="date"
                            value={moment(startDate).format('YYYY-MM-DD')}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                            style={{ marginLeft: 10 }}
                        />
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            style={{ marginLeft: 10 }}
                        />
                    </div>
                    <div style={{ marginTop: 10 }}>
                        End Date and Time:
                        <input
                            type="date"
                            value={moment(endDate).format('YYYY-MM-DD')}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                            style={{ marginLeft: 10 }}
                        />
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            style={{ marginLeft: 10 }}
                        />
                    </div>
                    <button onClick={handleCreateEvent} style={{ marginTop: 10 }}>Create Event</button>
                    <button onClick={() => setModalIsOpen(false)} style={{ marginTop: 10 }}>Cancel</button>
                </div>
            )}
        </>
    );
}

export default MyCalendar;