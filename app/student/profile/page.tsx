import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import Link from "next/link";

// Define TypeScript interfaces based on your GraphQL schema
interface Department {
  id: string;
  name: string;
  description?: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  courseType: string;
  description?: string;
}

// interface TimeSlotTemplate {
//   id: string;
//   name: string;
//   startTime: string;
//   endTime: string;
//   isWeekend: boolean;
// }

interface StaffProfile {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    username: string;
  };
}

interface BatchSchedule {
  id: string;
  courseUnit: {
    id: string;
    name: string;
    code: string;
  };
  startDate: string;
  endDate: string;
  timeSlot: {
    name: string;
    startTime: string;
    endTime: string;
  };
  instructor?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

interface Batch {
  id: string;
  name: string;
  course: Course;
  startDate: string;
  endDate: string;
  maxStudents: number;
  status: string;
  coordinator?: StaffProfile;
  schedule: BatchSchedule[];
}

interface Enrollment {
  id: string;
  status: string;
  completionPercentage: number;
  enrolledAt?: string;
  batch: Batch;
}

interface StudentProfile {
  id: string;
  department: Department;
  admissionDate: string;
  enrollmentStatus: string;
  enrollments: Enrollment[];
}

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  studentProfile: StudentProfile;
}

interface StudentProfileData {
  studentProfile: User;
}

// Define a type for the next class information
interface NextClassInfo {
  scheduleItem: BatchSchedule;
  batchInfo: Batch;
}

/**
 * GraphQL query to fetch detailed student profile data including courses and schedule
 */
const GET_STUDENT_PROFILE = gql`
  query GetStudentProfile {
    studentProfile {
      id
      username
      email
      firstName
      lastName
      isActive
      isVerified
      role
      studentProfile {
        id
        department {
          id
          name
          description
        }
        admissionDate
        enrollmentStatus
        enrollments {
          id
          status
          completionPercentage
          batch {
            id
            name
            course {
              id
              name
              code
              courseType
              description
            }
            startDate
            endDate
            status
            schedule {
              id
              courseUnit {
                id
                name
                code
              }
              startDate
              endDate
              timeSlot {
                name
                startTime
                endTime
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

/**
 * Format a date string into a user-friendly format
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a time string (from 24-hour format to 12-hour format)
 */
function formatTime(timeString: string): string {
  try {
    // Parse time in format HH:MM:SS
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  } catch  {
    return timeString; // Return original if parsing fails
  }
}

/**
 * Return a CSS class based on the enrollment or batch status
 */
function getStatusClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800';
    case 'UPCOMING':
      return 'bg-purple-100 text-purple-800';
    case 'ONGOING':
      return 'bg-yellow-100 text-yellow-800';
    case 'DROPPED':
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
    case 'ON_HOLD':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Find the next upcoming class from all enrollments
 */
function findNextClass(enrollments: Enrollment[]): NextClassInfo | null {
  const now = new Date();
  let nextClass: NextClassInfo | null = null;
  let earliestDate = new Date(8640000000000000); // Max date

  enrollments.forEach(enrollment => {
    if (enrollment.status !== 'ACTIVE') return;
    
    enrollment.batch.schedule.forEach(scheduleItem => {
      const startDate = new Date(scheduleItem.startDate);
      if (startDate > now && startDate < earliestDate) {
        earliestDate = startDate;
        nextClass = {
          scheduleItem: scheduleItem,
          batchInfo: enrollment.batch
        };
      }
    });
  });

  return nextClass;
}

/**
 * Student Profile Page Component
 */
export default async function StudentProfilePage() {
  // Get token from cookies
  const cookieStore = await cookies();
  const tokenInCookie = cookieStore.get("token")?.value;

  // Create Apollo client
  const client = createApolloClient();

  // Query GraphQL with the token in the Authorization header
  try {
    const { data } = await client.query<StudentProfileData>({
      query: GET_STUDENT_PROFILE,
      context: {
        headers: {
          Authorization: tokenInCookie ? `JWT ${tokenInCookie}` : "",
        },
      },
      fetchPolicy: "no-cache",
    });

    // Extract student data from the response
    const student = data?.studentProfile;
    const studentProfile = student?.studentProfile;
    const enrollments = studentProfile?.enrollments || [];
    
    // Calculate some stats
    const activeCourses = enrollments.filter(e => e.status === 'ACTIVE').length;
    const completedCourses = enrollments.filter(e => e.status === 'COMPLETED').length;
    const averageCompletion = enrollments.length > 0 
      ? enrollments.reduce((sum, e) => sum + Number(e.completionPercentage), 0) / enrollments.length 
      : 0;
    
    // Group enrollments by status for better organization
    const enrollmentsByStatus = {
      active: enrollments.filter(e => e.status === 'ACTIVE'),
      completed: enrollments.filter(e => e.status === 'COMPLETED'),
      other: enrollments.filter(e => !['ACTIVE', 'COMPLETED'].includes(e.status))
    };

    // Find the next upcoming class if available
    const nextClass = findNextClass(enrollments);

    return (
      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  Student Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome back, {student?.firstName || student?.username}
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusClass(studentProfile?.enrollmentStatus || '')}`}>
                  {studentProfile?.enrollmentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Profile & Stats Card */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
                
                <div className="border-t border-gray-200 pt-4">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                      <dd className="text-sm text-gray-900">
                        {student?.firstName && student?.lastName 
                          ? `${student.firstName} ${student.lastName}` 
                          : student?.username}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{student?.email}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Department</dt>
                      <dd className="text-sm text-gray-900">{studentProfile?.department.name}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Admission Date</dt>
                      <dd className="text-sm text-gray-900">
                        {studentProfile?.admissionDate 
                          ? formatDate(studentProfile.admissionDate) 
                          : "Not available"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Progress</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-blue-700">{activeCourses}</p>
                    <p className="text-sm text-blue-600">Active Courses</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-green-700">{completedCourses}</p>
                    <p className="text-sm text-green-600">Completed</p>
                  </div>
                  <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-gray-600">Overall Progress</p>
                      <p className="text-sm font-medium text-gray-900">{averageCompletion.toFixed(1)}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${averageCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Class Card */}
              {nextClass && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Next Upcoming Class</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="font-medium text-yellow-800">
                      {nextClass.scheduleItem.courseUnit.name}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {formatDate(nextClass.scheduleItem.startDate)} at {formatTime(nextClass.scheduleItem.timeSlot.startTime)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Time Slot: {nextClass.scheduleItem.timeSlot.name}
                    </p>
                    {nextClass.scheduleItem.instructor && (
                      <p className="text-sm text-gray-600 mt-1">
                        Instructor: {nextClass.scheduleItem.instructor.user.firstName} {nextClass.scheduleItem.instructor.user.lastName}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      Batch: {nextClass.batchInfo.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Enrollments Section */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">My Enrollments</h2>
                </div>

                {/* Active Enrollments */}
                {enrollmentsByStatus.active.length > 0 && (
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Active Enrollments
                    </h3>
                    <div className="space-y-4">
                      {enrollmentsByStatus.active.map((enrollment) => (
                        <div key={enrollment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{enrollment.batch.course.name}</h4>
                              <p className="text-sm text-gray-500">
                                {enrollment.batch.course.code} - Batch: {enrollment.batch.name}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(enrollment.status)}`}>
                              {enrollment.status}
                            </span>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{enrollment.completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${enrollment.completionPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Start Date</span>
                              <span>{formatDate(enrollment.batch.startDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>End Date</span>
                              <span>{formatDate(enrollment.batch.endDate)}</span>
                            </div>
                          </div>
                          
                          {/* Schedule Items */}
                          {enrollment.batch.schedule.length > 0 && (
                            <div className="mt-4">
                              <details className="text-sm">
                                <summary className="text-blue-600 font-medium cursor-pointer">
                                  View Schedule ({enrollment.batch.schedule.length} items)
                                </summary>
                                <div className="mt-2 pl-2 border-l-2 border-gray-200">
                                  {enrollment.batch.schedule.map((scheduleItem) => (
                                    <div key={scheduleItem.id} className="mb-3 pb-3 border-b border-gray-100">
                                      <p className="font-medium">{scheduleItem.courseUnit.name}</p>
                                      <p className="text-gray-600 text-xs">
                                        {formatDate(scheduleItem.startDate)} - {formatDate(scheduleItem.endDate)}
                                      </p>
                                      <p className="text-gray-600 text-xs">
                                        Time: {formatTime(scheduleItem.timeSlot.startTime)} - {formatTime(scheduleItem.timeSlot.endTime)}
                                      </p>
                                      {scheduleItem.instructor && (
                                        <p className="text-gray-600 text-xs">
                                          Instructor: {scheduleItem.instructor.user.firstName} {scheduleItem.instructor.user.lastName}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Enrollments */}
                {enrollmentsByStatus.completed.length > 0 && (
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Completed Courses
                    </h3>
                    <div className="space-y-2">
                      {enrollmentsByStatus.completed.map((enrollment) => (
                        <div key={enrollment.id} className="flex justify-between items-center px-3 py-2 hover:bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-gray-800">{enrollment.batch.course.name}</p>
                            <p className="text-sm text-gray-500">{enrollment.batch.course.code}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(enrollment.status)}`}>
                            {enrollment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Enrollments */}
                {enrollmentsByStatus.other.length > 0 && (
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Other Enrollments
                    </h3>
                    <div className="space-y-2">
                      {enrollmentsByStatus.other.map((enrollment) => (
                        <div key={enrollment.id} className="flex justify-between items-center px-3 py-2 hover:bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-gray-800">{enrollment.batch.course.name}</p>
                            <p className="text-sm text-gray-500">{enrollment.batch.course.code}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(enrollment.status)}`}>
                            {enrollment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Enrollments */}
                {enrollments.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No enrollments</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You are not enrolled in any courses yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    // Error handling
    console.error("Error fetching student profile:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-5 text-lg font-medium text-gray-900">Unable to load profile</h3>
          <p className="mt-2 text-sm text-gray-500">
            There was an error loading your student profile. Please try again later or contact support.
          </p>
          <div className="mt-6">
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}