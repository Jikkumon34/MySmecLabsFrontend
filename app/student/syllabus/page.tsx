// app/student/syllabus/page.tsx

import { cookies } from "next/headers";
import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import CourseAccordion from "@/components/students/CourseAccordion";

// Define TypeScript interfaces for GraphQL response data
interface Topic {
  id: string;
  title: string;
  description?: string;
  parentTopic?: Topic;
  subtopics?: Topic[];
  order: number;
}

interface Course {
  id: string;
  name: string;
  code: string;
  courseType: string;
  description?: string;
  parentCourse?: Course;
  subcourses?: Course[];
  topics?: Topic[];
  order: number;
  recommendedDuration?: number;
}

// interface Department {
//   id: string;
//   name: string;
// }

// interface StudentProfile {
//   id: string;
//   department: Department;
//   enrollmentStatus: string;
// }

// interface User {
//   id: string;
//   username: string;
//   firstName?: string;
//   lastName?: string;
//   studentProfile: StudentProfile;
// }

interface StudentSyllabusData {
  studentCourses: {
    mainCourses: Course[];
  };
}

// GraphQL query for fetching the student's syllabus
const GET_STUDENT_SYLLABUS = gql`
  query GetStudentSyllabus {
    studentCourses {
      mainCourses {
        id
        name
        code
        courseType
        description
        order
        recommendedDuration
        subcourses {
          id
          name
          code
          courseType
          description
          order
          recommendedDuration
          subcourses {
            id
            name
            code
            courseType
            description
            order
            recommendedDuration
            topics {
              id
              title
              description
              order
              subtopics {
                id
                title
                description
                order
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Syllabus Page Component - Shows the complete course structure for enrolled students
 */
export default async function StudentSyllabus() {
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
    const { data } = await client.query<StudentSyllabusData>({
      query: GET_STUDENT_SYLLABUS,
      context: {
        headers: {
          Authorization: `JWT ${token}`
        },
      },
      fetchPolicy: "no-cache"
    });
    
    // Extract the main courses from the data
    const mainCourses = data?.studentCourses?.mainCourses || [];
    
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2E3192]">Course Syllabus</h1>
            <p className="text-gray-600">Explore your course structure and learning path</p>
          </div>
          
          <Link 
            href="/student/dashboard" 
            className="mt-2 md:mt-0 inline-flex items-center text-[#2E3192] hover:text-blue-700"
          >
            <span>Back to Dashboard</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {mainCourses.length > 0 ? (
          <div className="space-y-6">
            {mainCourses.map((mainCourse) => (
              <CourseAccordion key={mainCourse.id} course={mainCourse} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-700">No Courses Available</h2>
            <p className="mt-2 text-gray-500">You are not enrolled in any courses yet or your syllabus hasn&apos;t been set up.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching syllabus data:", error);
    
    // Display error state
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mt-4">Unable to load syllabus</h3>
          <p className="text-gray-600 mt-2">
            There was an error loading your course syllabus. Please try again later or contact support.
          </p>
          <div className="mt-6">
            <Link href="/student/dashboard" className="inline-block bg-[#2E3192] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
}