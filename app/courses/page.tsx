
import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";

import Link from "next/link";

// Define TypeScript interfaces for GraphQL response data
interface CoursePresentation {
  thumbnailUrl: string;
  subtitle: string;
  shortDescription: string;
  isSelfPaced: boolean;
  totalHours: number;
  studentCount: number;
  averageRating: number;
  reviewCount: number;
}

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  slug: string;
  presentation: CoursePresentation;
}

interface Department {
  id: string;
  name: string;
}

interface CoursesData {
  mainCourses: Course[];
  departments: Department[];
}

// GraphQL query for main courses and departments
const GET_MAIN_COURSES = gql`
  query GetMainCourses($departmentId: ID, $search: String) {
    mainCourses(departmentId: $departmentId, search: $search) {
      id
      name
      code
      description
      slug
      presentation {
        subtitle
        thumbnailUrl
        shortDescription
        isSelfPaced
        totalHours
        studentCount
        averageRating
        reviewCount
      }
    }
    departments {
      id
      name
    }
  }
`;

/** Helpers **/
function truncateDescription(
  description: string,
  maxLength: number = 150
): string {
  return description.length <= maxLength
    ? description
    : description.substring(0, maxLength) + "...";
}

/**
 * Courses Page
 */
export default async function Courses({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // 1. Await the lazy searchParams
  const params = await searchParams;

  // 2. Pull out and normalize each filter
  const rawDepartmentId = params.departmentId;
  const rawSearch = params.search;

  const departmentId = Array.isArray(rawDepartmentId) ? rawDepartmentId[0] : rawDepartmentId;
  const search = Array.isArray(rawSearch) ? rawSearch[0] : rawSearch;



  // 4. Fetch data
  const client = createApolloClient();
  try {
    const { data } = await client.query<CoursesData>({
      query: GET_MAIN_COURSES,
      variables: {
        departmentId,
        search,
      },

      fetchPolicy: "no-cache",
    });

    const courses = data.mainCourses;
    const departments = data.departments;

    // 5. Render
    return (
      <main className="container mx-auto px-4 py-8">
        {/* Header with Search Results */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="mr-2 text-gray-700">Sort by:</span>
              <div className="relative inline-block">
                <select className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                  <option>Best Match</option>
                  <option>Highest Rated</option>
                  <option>Most Recent</option>
                  <option>Most Popular</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filter by</h2>
                <Link href="/courses" className="text-blue-600 text-sm font-medium hover:text-blue-800">Reset All</Link>
              </div>

              {/* Department Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 text-lg mb-3 flex items-center justify-between">
                  Department
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </h3>
                <div className="space-y-3">
                  {departments.map((dept) => (
                    <label key={dept.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={departmentId === dept.id}
                        readOnly
                      />
                      <Link
                        href={`/courses?departmentId=${dept.id}`}
                        className="ml-3 text-gray-700 hover:text-blue-600"
                      >
                        {dept.name}
                      </Link>
                    </label>

                  ))}
                  {departments.length > 4 && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 flex items-center">
                      Show {departments.length > 4 ? departments.length - 4 : 0} more
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <form method="GET" action="/courses">
                {departmentId && (
                  <input type="hidden" name="departmentId" value={departmentId} />
                )}
                <div className="mb-4">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Courses
                  </label>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    defaultValue={search || ""}
                    placeholder="Search by name or keyword..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out font-medium">
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Course Grid */}
          <div className="w-full lg:w-3/4">
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="
                        bg-white
                        rounded-xl
                        shadow-md
                        overflow-hidden
                        hover:shadow-lg
                        transition-shadow
                        duration-300
                        flex
                        flex-col
                        h-full
                        cursor-pointer
                      "
                  >

                    <div className="relative">
                      <img src={course.presentation.thumbnailUrl} alt={course.name} className="w-full h-48 object-cover" />
                      <div className="absolute top-3 left-3 flex items-center space-x-2">
                        <div className="bg-white rounded-full p-1 shadow">
                          <img src={course.presentation.thumbnailUrl} alt="Provider Logo" className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <span>{course.code}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight">{course.name}</h3>
                      <div className="mb-3 flex-grow">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Skills you&apos;ll gain:</p>
                        <p className="text-sm text-gray-600">{truncateDescription(course.description)}</p>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span className="ml-1 font-bold text-gray-900">
                            {Number(course.presentation.averageRating).toFixed(1)}
                          </span>                        </div>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-gray-600 text-sm">{course.presentation.reviewCount} reviews</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mr-2">
                          {course.presentation.isSelfPaced ? "Self-paced" : "Instructor-led"}
                        </span>
                        <span>Course • {course.presentation.totalHours} Hours</span>
                      </div>
                    </div>

                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No courses found</h3>
                <p className="mt-2 text-center text-gray-600">
                  We couldn&apos;t find any courses matching your criteria. Try adjusting your filters or search terms.
                </p>
                <Link href="/courses" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  View All Courses
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mt-4">Unable to load courses</h3>
          <p className="text-gray-600 mt-2">
            There was an error loading the courses. Please try again later or contact support.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
}