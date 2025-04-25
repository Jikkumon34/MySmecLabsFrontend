import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import Link from "next/link";

// Define TypeScript interfaces based on your GraphQL schema
interface Course {
    id: string;
    name: string;
    code: string;
}

interface Library {
    id: string;
    title: string;
    slug: string;
    description: string;
}

interface StudentUnitWithLibrary {
    course: Course;
    library: Library | null;
}

interface StudentUnitsData {
    studentUnitsWithLibrary: StudentUnitWithLibrary[];
}

// GraphQL query to fetch student units with library info
const GET_STUDENT_UNITS_WITH_LIBRARY = gql`
  query GetStudentUnitsWithLibrary {
    studentUnitsWithLibrary {
      course {
        id
        name
        code
      }
      library {
        id
        title
        slug
        description
      }
    }
  }
`;

export default async function StudentLibraryPage() {
    // Get token from cookies
    const cookieStore = await cookies();
    const tokenInCookie = cookieStore.get("token")?.value;

    // Create Apollo client
    const client = createApolloClient();

    try {
        // Query GraphQL with the token in the Authorization header
        const { data } = await client.query<StudentUnitsData>({
            query: GET_STUDENT_UNITS_WITH_LIBRARY,
            context: {
                headers: {
                    Authorization: tokenInCookie ? `JWT ${tokenInCookie}` : "",
                },
            },
            fetchPolicy: "no-cache",
        });

        // Extract student units data from the response
        const studentUnits = data?.studentUnitsWithLibrary || [];

        return (
            <main className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="md:flex md:items-center md:justify-between">
                            <div className="md:flex-1">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Learning Library
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Access learning materials for your enrolled courses
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {studentUnits.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {studentUnits.map((unitWithLibrary) => (
                                <CourseLibraryCard
                                    key={unitWithLibrary.course.id}
                                    unitWithLibrary={unitWithLibrary}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto h-16 w-16 text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                You&apos;re not enrolled in any courses with library content yet.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        );
    } catch (error) {
        console.error("Error fetching student library data:", error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="mt-5 text-lg font-medium text-gray-900">Unable to load library</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        There was an error loading your course library. Please try again later or contact support.
                    </p>
                    <div className="mt-6">
                        <Link href="/student/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

// Component for each course library card
function CourseLibraryCard({ unitWithLibrary }: { unitWithLibrary: StudentUnitWithLibrary }) {
    const { course, library } = unitWithLibrary;

    // Generate placeholder colors based on course name
    const colors = ['blue', 'green', 'purple', 'orange', 'teal', 'pink'];
    const colorIndex = course.name.length % colors.length;
    const bgColor = `bg-${colors[colorIndex]}-100`;
    const textColor = `text-${colors[colorIndex]}-800`;
    const borderColor = `border-${colors[colorIndex]}-200`;

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className={`${bgColor} ${textColor} p-6`}>
                <div className="flex justify-between items-start">
                    <div>
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-white mb-2">
                            {course.code}
                        </span>
                        <h3 className="text-lg font-semibold">{course.name}</h3>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className={textColor} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {library ? (
                    <>
                        <p className="text-gray-600 text-sm mb-4">
                            {library.description || `Access learning materials for ${course.name}`}
                        </p>
                        <Link
                            href={`/library/${library.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Open Library
                        </Link>

                    </>
                ) : (
                    <div className={`p-4 rounded-md ${bgColor} ${borderColor} border`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className={textColor} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className={`text-sm font-medium ${textColor}`}>Library not available</h3>
                                <div className="mt-2 text-sm">
                                    <p className="text-gray-600">
                                        Library content for this course is currently being prepared.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}