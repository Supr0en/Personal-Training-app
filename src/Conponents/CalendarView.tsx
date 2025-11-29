import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { useState, useEffect } from 'react';
import { getTrainings } from '../TraininingApi';
import type { Training } from './Types';

interface Event {
  title: string;
  start: Date;
  end: Date;
}

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function CalendarView() {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    getTrainings()
      .then(trainings => {
        const list: Training[] = trainings._embedded?.trainings ?? [];
        return Promise.all(
          list.map(training => 
            fetch(training._links.customer.href)
              .then(res => res.json())
              .then(details => ({
                ...training,
                details: {
                  firstname: details.firstname,
                  lastname: details.lastname,
                },
              }))
          )
        );
      })
      .then(fullTrainings => {
        const calendarEvents: Event[] = fullTrainings.map((training) => {
          const startDate = new Date(training.date);
          const start = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            startDate.getHours(),
            startDate.getMinutes()
          );
          const end = new Date(start.getTime() + training.duration * 60 * 1000);
          const { firstname, lastname } = training.details || {};
          const title = `${training.activity} / ${firstname || ''} ${lastname || ''}`.trim();
          return { title, start, end };
        });
        setEvents(calendarEvents);
      })
      .catch(error =>  {
        console.error('Error fetching trainings:', error);
      });
  }, []);
  return (
    <Calendar 
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      defaultView={Views.WEEK}
      views={[Views.WEEK, Views.DAY, Views.MONTH]}
      onView={() => {}}
      style={{ height: 600 }}
      toolbar={true}
    />
  )  
}
export default CalendarView;
