/* ---------- StudentCalendar.tsx (client component) ---------- */
'use client';

import {
  Calendar,
  Views,
  dateFnsLocalizer,
  Event as RBCEvent,
  View,
} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendarOverrides.css';

import {
  CSSProperties,
  Fragment,
  useEffect,

  useState,
} from 'react';

/* ---------- Types ---------- */

export interface CalendarEvent extends RBCEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
  allDay?: boolean;
  resource: {
    courseUnitCode: string;
    courseUnitName: string;
    batchName: string;
    instructorName?: string;
    timeSlotName: string;
  };
}

interface StudentCalendarProps {
  events: CalendarEvent[];
}

/* ---------- Localiser ---------- */

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

/* ---------- Component ---------- */

const StudentCalendar: React.FC<StudentCalendarProps> = ({ events }) => {
  /* --- 1.  Responsive view ------------------------------------------------ */
  const isMobile = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 640px)').matches;

  // view = current calendar view (controlled)
  const [view, setView] = useState<View>(isMobile() ? Views.AGENDA : Views.MONTH);

  // date = the focused date (back / next / today buttons control this)
  const [date, setDate] = useState<Date>(new Date());

  /*  When the screen is resized (e.g. rotate a phone), switch between
      Agenda <‑‑> Month automatically so the calendar never gets “stuck”.      */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(max-width: 640px)');
    const handler = () => setView(mq.matches ? Views.AGENDA : Views.MONTH);

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* --- 2.  Styling helpers ------------------------------------------------ */
  const EVENT_COLOR = '#d9dbda'; // Tailwind sky‑500

  const eventPropGetter = (): { style?: CSSProperties } => ({
    style: {
      backgroundColor: EVENT_COLOR,
      borderRadius: 6,
      color: 'white',
      paddingInline: 6,
      border: 'none',
    },
  });

  const EventRenderer = ({ event }: { event: CalendarEvent }) => (
    <Fragment>
      <strong>{event.title}</strong>
      <div className="text-xs opacity-80">{event.resource.batchName}</div>
    </Fragment>
  );

  /* --- 3.  Render --------------------------------------------------------- */
  return (
    <div className="p-4 bg-white shadow-md rounded-xl h-[calc(100vh-6rem)] overflow-hidden">
      <Calendar
        /** data & localisation */
        localizer={localizer}
        events={events}

        /** controlled view & date */
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}

        /** available views */
        views={[Views.MONTH, Views.WEEK, Views.AGENDA]}

        /** misc */
        startAccessor="start"
        endAccessor="end"
        popup
        eventPropGetter={eventPropGetter}
        components={{ event: EventRenderer }}
        className="h-full"
      />
    </div>
  );
};

export default StudentCalendar;
