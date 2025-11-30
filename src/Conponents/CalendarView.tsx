import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import {enUS} from 'date-fns/locale/en-US';
import { useState, useEffect } from 'react';
import { getTrainings } from '../TraininingApi';
import type { Training } from './Types';
import '../assets/styles/CalendarStyles.css';
import type { ToolbarProps, View } from 'react-big-calendar';

interface Event {
  title: string;
  start: Date;
  end: Date;
}

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function CustomToolbar(toolbar: ToolbarProps) {
  const views: View[] = Array.isArray(toolbar.views) 
    ? toolbar.views : 
    Object.keys(toolbar.views ?? {}).filter(
    (key): key is View => !!toolbar.views?.[key]
  );

  console.log(views)
  return (
    <div className="flex flex-wrap gap-2 justify-between items-center mb-4 p-2">
      <span className="text-xl font-bold text-gray-800">
        {toolbar.label}
      </span>

      <div className="flex gap-2">
        {views.map((view: View) => (
          <button
            key={view}
            onClick={() => toolbar.onView(view)}
            className={`px-3 py-1 rounded-lg border text-sm ${
              toolbar.view === view
                ? "bg-slate-500 text-white border-slate-500"
                : "border-gray-200 hover:bg-gray-100"
            }`}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  )
}
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
  const [view, setView] = useState<View>('week');
  return (
    <Calendar 
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      view={view}
      views={["month", "week", "day", "agenda"]}
      onView={(v: View) => setView(v)}
      style={{ height: 600 }}
      components={{ toolbar: CustomToolbar }}
      toolbar={true}
    />
  )  
}
export default CalendarView;
