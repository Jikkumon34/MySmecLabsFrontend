import { cookies } from "next/headers";
import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { redirect } from "next/navigation";
import Link from "next/link";

// Define TypeScript interfaces for GraphQL response data
interface Course {
  id: string;
  name: string;
  code: string;
  courseType: string;
  description?: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
}

interface Batch {
  id: string;
  name: string;
  course: Course;
  startDate: string;
  endDate: string;
  status: string;
}

interface Enrollment {
  id: string;
  status: string;
  completionPercentage: number;
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
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  studentProfile: StudentProfile;
}

interface StudentProfileData {
  studentProfile: User;
}

// Assignment interface for placeholder data
interface Assignment {
  id: string;
  courseName: string;
  title: string;
  deadline: string;
  status: string;
}

// GraphQL query for student data
const GET_STUDENT_PROFILE = gql`
  query GetStudentProfile {
    studentProfile {
      id
      username
      email
      firstName
      lastName
      role
      isActive
      isVerified
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
 * Get the appropriate CSS class for a status label
 */
function getStatusClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800';
    case 'DROPPED':
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'NOT STARTED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Calculate overall progress across all enrollments
 */
function calculateOverallProgress(enrollments: Enrollment[]): number {
  if (enrollments.length === 0) return 0;
  
  const total = enrollments.reduce((sum, enrollment) => {
    return sum + parseFloat(enrollment.completionPercentage.toString());
  }, 0);
  
  return total / enrollments.length;
}

/**
 * Student Dashboard Page Component
 */
export default async function StudentDashboard() {
  // Get JWT token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  // If no token, redirect to login
  if (!token) {
    redirect("/login");
  }
  
  // Create Apollo client
  const client = createApolloClient();
  
  try {
    // Query GraphQL with JWT authentication
    const { data } = await client.query<StudentProfileData>({
      query: GET_STUDENT_PROFILE,
      context: {
        headers: {
          Authorization: `JWT ${token}`
        },
      },
      fetchPolicy: "no-cache"
    });
    
    const studentData = data.studentProfile;
    const enrollments = studentData?.studentProfile?.enrollments || [];
    const overallProgress = calculateOverallProgress(enrollments);
    
    // Sample assignment data (in a real app, this would come from an API)
    const assignments: Assignment[] = [
      {
        id: "1",
        courseName: "Web Development",
        title: "React Components Assignment",
        deadline: "2025-04-20",
        status: "Pending"
      },
      {
        id: "2",
        courseName: "Backend Development",
        title: "Django API Project",
        deadline: "2025-04-25",
        status: "Not Started"
      }
    ];
    
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold text-[#2E3192] mb-6">Student Dashboard</h1>
        
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="bg-[#2E3192] p-4 text-white">
            <h2 className="text-xl font-semibold">Student Profile</h2>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-[#606060]">
                  {studentData?.firstName && studentData?.lastName 
                    ? `${studentData.firstName} ${studentData.lastName}` 
                    : studentData?.username}
                </h3>
                <p className="text-gray-500">{studentData?.email}</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{studentData?.studentProfile?.department?.name || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        getStatusClass(studentData?.studentProfile?.enrollmentStatus || '')
                      }`}>
                        {studentData?.studentProfile?.enrollmentStatus || "Pending"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-medium">
                      {studentData?.studentProfile?.admissionDate 
                        ? formatDate(studentData.studentProfile.admissionDate) 
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-medium">{studentData?.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Summary */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="bg-[#00A99D] p-4 text-white">
            <h2 className="text-xl font-semibold">Learning Progress</h2>
          </div>
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-700">
                  {enrollments.filter(e => e.status === 'ACTIVE').length}
                </p>
                <p className="text-sm text-blue-600">Active Courses</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-700">
                  {enrollments.filter(e => e.status === 'COMPLETED').length}
                </p>
                <p className="text-sm text-green-600">Completed Courses</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-purple-700">{overallProgress.toFixed(1)}%</p>
                <p className="text-sm text-purple-600">Overall Progress</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-600">Overall Completion</p>
                <p className="text-sm font-medium text-gray-900">{overallProgress.toFixed(1)}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-[#00A99D] h-2.5 rounded-full" 
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enrolled Courses */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="bg-[#0071BC] p-4 text-white">
            <h2 className="text-xl font-semibold">Enrolled Courses</h2>
          </div>
          <div className="p-4 md:p-6">
            {enrollments.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-[#2E3192]">{enrollment.batch.course.name}</h3>
                        <p className="text-sm text-gray-500">Code: {enrollment.batch.course.code}</p>
                        <p className="text-sm text-gray-500">Batch: {enrollment.batch.name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusClass(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{enrollment.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-[#00A99D] h-2.5 rounded-full" 
                          style={{ width: `${enrollment.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span>{formatDate(enrollment.batch.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>End Date:</span>
                        <span>{formatDate(enrollment.batch.endDate)}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Batch Status:</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusClass(enrollment.batch.status)}`}>
                          {enrollment.batch.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                <p className="text-gray-500 mt-2">You are not enrolled in any courses yet.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming Assignments */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#00A99D] p-4 text-white">
            <h2 className="text-xl font-semibold">Upcoming Assignments</h2>
          </div>
          <div className="p-4 md:p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 md:p-3 text-left text-gray-600">Course</th>
                    <th className="p-2 md:p-3 text-left text-gray-600">Assignment</th>
                    <th className="p-2 md:p-3 text-left text-gray-600">Deadline</th>
                    <th className="p-2 md:p-3 text-left text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(assignment => (
                    <tr key={assignment.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 md:p-3">{assignment.courseName}</td>
                      <td className="p-2 md:p-3">{assignment.title}</td>
                      <td className="p-2 md:p-3">{formatDate(assignment.deadline)}</td>
                      <td className="p-2 md:p-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusClass(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching student data:", error);
    
    // Display error state
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mt-4">Unable to load dashboard</h3>
          <p className="text-gray-600 mt-2">
            There was an error loading your student data. Please try again later or contact support.
          </p>
          <div className="mt-6">
            <Link href="/" className="inline-block bg-[#2E3192] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}