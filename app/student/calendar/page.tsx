/* app/student/calendar/page.tsx */
import { cookies } from 'next/headers';
import { gql } from '@apollo/client';
import { createApolloClient } from '@/lib/apolloClient';
import StudentCalendar, {
  CalendarEvent,
} from '@/components/students/StudentCalendar';

/* ---------- GraphQL types ---------- */

interface GQLScheduleItem {
  id: string;
  isRecurring: boolean;
  sessionDate?: string;
  startDate: string;
  endDate: string;
  daysOfWeekList: number[];      // 0 = Monday … 6 = Sunday (ISO‑style!)
  timeSlot: {
    name: string;
    startTime: string;
    endTime: string;
  };
  courseUnit: {
    id: string;
    name: string;
    code: string;
  };
  instructor?: { user: { firstName: string; lastName: string } };
}

interface GQLEnrollment {
  id: string;
  status: string;
  batch: { name: string; schedule: GQLScheduleItem[] };
}

interface StudentScheduleData {
  studentProfile: { studentProfile: { enrollments: GQLEnrollment[] } };
}

/* ---------- GraphQL query ---------- */

const GET_STUDENT_SCHEDULE = gql`
  query GetStudentSchedule {
    studentProfile {
      studentProfile {
        enrollments {
          id
          status
          batch {
            name
            schedule {
              id
              isRecurring
              sessionDate
              startDate
              endDate
              daysOfWeekList
              timeSlot {
                name
                startTime
                endTime
              }
              courseUnit {
                id
                name
                code
              }
              instructor {
                user {
                  firstName
                  lastName
                }
              }
            }
          }
        }
      }
    }
  }
`;

/* ---------- Utilities ---------- */

const combineDateTime = (dateStr: string, timeStr: string) =>
  new Date(`${dateStr}T${timeStr}`);

const jsToIso = (jsDay: number) => (jsDay + 6) % 7; // 0‑Sun → 0‑Mon

const expandRecurring = (
  item: GQLScheduleItem,
  batchName: string,
  horizonDays = 120,
): CalendarEvent[] => {
  const occurrences: CalendarEvent[] = [];
  const start = new Date(item.startDate);
  const end = new Date(item.endDate);
  const today = new Date();
  const calendarEnd = new Date(today);
  calendarEnd.setDate(calendarEnd.getDate() + horizonDays);

  for (let d = new Date(start); d <= end && d <= calendarEnd; d.setDate(d.getDate() + 1)) {
    if (item.daysOfWeekList.includes(jsToIso(d.getDay()))) {
      const isoDate = d.toISOString().slice(0, 10);
      occurrences.push({
        id: `${item.id}-${isoDate}`,
        title: item.courseUnit.name,
        start: combineDateTime(isoDate, item.timeSlot.startTime),
        end: combineDateTime(isoDate, item.timeSlot.endTime),
        allDay: false,
        resource: {
          courseUnitCode: item.courseUnit.code,
          courseUnitName: item.courseUnit.name,
          batchName,
          instructorName: item.instructor
            ? `${item.instructor.user.firstName} ${item.instructor.user.lastName}`
            : undefined,
          timeSlotName: item.timeSlot.name,
        },
      });
    }
  }
  return occurrences;
};

/* ---------- Page ---------- */

export default async function CalendarPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const client = createApolloClient();

  const { data } = await client.query<StudentScheduleData>({
    query: GET_STUDENT_SCHEDULE,
    context: { headers: { Authorization: token ? `JWT ${token}` : '' } },
    fetchPolicy: 'no-cache',
  });

  const events: CalendarEvent[] = [];

  data.studentProfile.studentProfile.enrollments
    .filter((e) => e.status === 'ACTIVE')
    .forEach(({ batch }) => {
      const { name: batchName } = batch;

      batch.schedule.forEach((item) => {
        if (item.isRecurring) {
          events.push(...expandRecurring(item, batchName));
          return;
        }

        const startDate = item.sessionDate ?? item.startDate;
        const endDate = item.sessionDate ?? item.endDate;

        events.push({
          id: item.id,
          title: item.courseUnit.name,
          start: combineDateTime(startDate, item.timeSlot.startTime),
          end: combineDateTime(endDate, item.timeSlot.endTime),
          allDay: false,
          resource: {
            courseUnitCode: item.courseUnit.code,
            courseUnitName: item.courseUnit.name,
            batchName,
            instructorName: item.instructor
              ? `${item.instructor.user.firstName} ${item.instructor.user.lastName}`
              : undefined,
            timeSlotName: item.timeSlot.name,
          },
        });
      });
    });

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">My Schedule</h1>
      <StudentCalendar events={events} />
    </main>
  );
}
