import React from 'react';
import Navbar from '../components/Navbar'; 
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import MyCalendar from '../components/Calendar';

const localizer = momentLocalizer(moment)

function EventsCalendar() {
  return (
    <>
    <Navbar />
      <div>Events</div>
      <MyCalendar />
    </>
  );
}

export default EventsCalendar;
