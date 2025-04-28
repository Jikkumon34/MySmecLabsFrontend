import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import Link from "next/link";
export const metadata = {
  title: 'Profile | SmecLabs',
};
// TypeScript interfaces for GraphQL schema
interface Department { id: string; name: string; description?: string; }
interface Course { id: string; name: string; code: string; courseType: string; description?: string; }
interface StaffProfile { id: string; user: { firstName: string; lastName: string; username: string; }; }
interface BatchSchedule {
  id: string;
  courseUnit: { id: string; name: string; code: string; };
  startDate: string;
  endDate: string;
  timeSlot: { name: string; startTime: string; endTime: string; };
  instructor?: { user: { firstName: string; lastName: string; }; };
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
interface StudentProfileData { studentProfile: User; }
interface NextClassInfo { scheduleItem: BatchSchedule; batchInfo: Batch; }

// GraphQL query
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

// Helper functions
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function formatTime(timeString: string): string {
  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  } catch {
    return timeString;
  }
}

function getStatusClass(status: string): string {
  const statusMap: Record<string, string> = {
    'ACTIVE': 'bg-green-100 text-green-800',
    'COMPLETED': 'bg-blue-100 text-blue-800',
    'UPCOMING': 'bg-purple-100 text-purple-800',
    'ONGOING': 'bg-yellow-100 text-yellow-800',
    'DROPPED': 'bg-red-100 text-red-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'PENDING': 'bg-orange-100 text-orange-800',
    'ON_HOLD': 'bg-orange-100 text-orange-800'
  };
  return statusMap[status.toUpperCase()] || 'bg-gray-100 text-gray-800';
}

function findNextClass(enrollments: Enrollment[]): NextClassInfo | null {
  const now = new Date();
  let nextClass: NextClassInfo | null = null;
  let earliestDate = new Date(8640000000000000);

  enrollments.forEach(enrollment => {
    if (enrollment.status !== 'ACTIVE') return;
    
    enrollment.batch.schedule.forEach(scheduleItem => {
      const startDate = new Date(scheduleItem.startDate);
      if (startDate > now && startDate < earliestDate) {
        earliestDate = startDate;
        nextClass = { scheduleItem, batchInfo: enrollment.batch };
      }
    });
  });

  return nextClass;
}

// Components
const ProfileHeader = ({ student }: { student: User }) => {
  const initials = student.firstName?.[0] || student.username?.[0] || "S";
  const fullName = student.firstName && student.lastName 
    ? `${student.firstName} ${student.lastName}` : student.username;
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-8 rounded-lg shadow-lg">
      <div className="flex items-center space-x-6">
        <div className="bg-white text-blue-700 rounded-full h-24 w-24 flex items-center justify-center text-3xl font-bold shadow-md">
          {initials}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{fullName}</h1>
          <p className="text-blue-100 mt-1">{student.email}</p>
          <div className="flex items-center mt-3">
            <span className={`px-3 py-1 rounded-full bg-white text-sm font-medium ${student.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {student.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className="ml-3 px-3 py-1 rounded-full bg-white text-sm font-medium text-blue-700">
              {student.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({  studentProfile }: {  studentProfile: StudentProfile }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-gray-50 px-6 py-4 border-b">
      <h2 className="text-lg font-semibold text-gray-800">Student Information</h2>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Department</h3>
          <p className="text-gray-900">{studentProfile.department.name}</p>
          {studentProfile.department.description && (
            <p className="text-sm text-gray-500 mt-1">{studentProfile.department.description}</p>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Admission Date</h3>
          <p className="text-gray-900">{formatDate(studentProfile.admissionDate)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Enrollment Status</h3>
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(studentProfile.enrollmentStatus)}`}>
            {studentProfile.enrollmentStatus}
          </span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Student ID</h3>
          <p className="text-gray-900">{studentProfile.id}</p>
        </div>
      </div>
    </div>
  </div>
);

const AcademicInfoCard = ({ enrollments }: { enrollments: Enrollment[] }) => {
  const activeCourses = enrollments.filter(e => e.status === 'ACTIVE').length;
  const completedCourses = enrollments.filter(e => e.status === 'COMPLETED').length;
  const totalCourses = enrollments.length;
  const averageCompletion = enrollments.length > 0 
    ? enrollments.reduce((sum, e) => sum + Number(e.completionPercentage), 0) / enrollments.length 
    : 0;
  
  // Get all active courses for detailed display
  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE');
    
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Academic Information</h2>
      </div>
      <div className="p-6">
        {/* Progress Summary */}
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Progress Overview</h3>
          <div className="flex justify-between mb-4">
            <div className="text-center px-4">
              <p className="text-3xl font-bold text-blue-600">{activeCourses}</p>
              <p className="text-sm text-gray-500 mt-1">Active</p>
            </div>
            <div className="text-center px-4">
              <p className="text-3xl font-bold text-green-600">{completedCourses}</p>
              <p className="text-sm text-gray-500 mt-1">Completed</p>
            </div>
            <div className="text-center px-4">
              <p className="text-3xl font-bold text-gray-700">{totalCourses}</p>
              <p className="text-sm text-gray-500 mt-1">Total</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-700">Overall Completion</p>
              <p className="text-sm font-bold text-blue-600">{averageCompletion.toFixed(1)}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${averageCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Active Courses Info */}
        <div className="mt-6">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Current Courses</h3>
          {activeEnrollments.length > 0 ? (
            <div className="space-y-4">
              {activeEnrollments.map(enrollment => (
                <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{enrollment.batch.course.name}</h4>
                      <p className="text-sm text-gray-600">{enrollment.batch.course.code} - {enrollment.batch.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(enrollment.status)}`}>
                      {enrollment.status}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-blue-600">{enrollment.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${enrollment.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Period:</span> 
                      <span className="ml-1 text-gray-700">{formatDate(enrollment.batch.startDate)} - {formatDate(enrollment.batch.endDate)}</span>
                    </div>
                    {enrollment.batch.coordinator && (
                      <div>
                        <span className="text-gray-500">Coordinator:</span> 
                        <span className="ml-1 text-gray-700">
                          {enrollment.batch.coordinator.user.firstName} {enrollment.batch.coordinator.user.lastName}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Instructors List */}
                  {enrollment.batch.schedule.length > 0 && (
                    <div className="mt-3">
                      <details className="text-sm">
                        <summary className="cursor-pointer text-blue-600 font-medium">
                          View Instructors & Schedule
                        </summary>
                        <div className="mt-2 space-y-2 pl-2">
                          {enrollment.batch.schedule
                            .filter(item => item.instructor)
                            .map((item, index) => (
                              <div key={index} className="text-gray-700">
                                <span className="font-medium">{item.courseUnit.name}:</span> {item.instructor?.user.firstName} {item.instructor?.user.lastName}
                              </div>
                            ))
                          }
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No active courses at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NextClassCard = ({ nextClass }: { nextClass: NextClassInfo | null }) => {
  if (!nextClass) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Next Scheduled Class</h2>
      </div>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 text-blue-600 rounded-lg p-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{nextClass.scheduleItem.courseUnit.name}</h3>
            <p className="text-blue-600 font-medium mt-1">
              {formatDate(nextClass.scheduleItem.startDate)} at {formatTime(nextClass.scheduleItem.timeSlot.startTime)}
            </p>
            <div className="mt-3 text-gray-600">
              <p>
                <span className="font-medium">Course:</span> {nextClass.batchInfo.course.name} ({nextClass.batchInfo.course.code})
              </p>
              <p>
                <span className="font-medium">Batch:</span> {nextClass.batchInfo.name}
              </p>
              {nextClass.scheduleItem.instructor && (
                <p>
                  <span className="font-medium">Instructor:</span> {nextClass.scheduleItem.instructor.user.firstName} {nextClass.scheduleItem.instructor.user.lastName}
                </p>
              )}
              <p>
                <span className="font-medium">Duration:</span> {formatTime(nextClass.scheduleItem.timeSlot.startTime)} - {formatTime(nextClass.scheduleItem.timeSlot.endTime)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
export default async function StudentProfilePage() {
  const cookieStore = await cookies();
  const tokenInCookie = cookieStore.get("token")?.value;
  const client = createApolloClient();

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

    const student = data?.studentProfile;
    const studentProfile = student?.studentProfile;
    const enrollments = studentProfile?.enrollments || [];
    const nextClass = findNextClass(enrollments);

    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
          </div>
          
          {/* Profile Header */}
          <ProfileHeader student={student} />
          
          {/* Information Cards */}
          <div className="grid grid-cols-1 gap-6 mt-8">
            <InfoCard  studentProfile={studentProfile} />
            <AcademicInfoCard enrollments={enrollments} />
          </div>
          
          {/* Next Class Card - Only show if there's a next class */}
          {nextClass && (
            <div className="mt-8">
              <NextClassCard nextClass={nextClass} />
            </div>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-medium text-gray-900">Unable to Load Profile</h3>
          <p className="mt-3 text-gray-600">
            There was an error loading your student profile. Please try again later or contact support if the issue persists.
          </p>
          <div className="mt-6">
            <Link href="/" className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}