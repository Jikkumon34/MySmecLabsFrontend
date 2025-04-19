import { cookies } from "next/headers";
import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Define TypeScript interfaces
interface Course {
  id: string;
  name: string;
  code: string;
}

interface Department {
  id: string;
  name: string;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface StaffProfile {
  id: string;
  bio: string;
  isHod: boolean;
  profileImage?: string;
  joiningDate: string;
  user: User;
  department: Department;
  courses: Course[];
}

interface StaffData {
  staffByDepartment: StaffProfile[];
}

// GraphQL query
const GET_STAFF_BY_DEPARTMENT = gql`
  query GetStaffByDepartment {
    staffByDepartment {
      id
      bio
      isHod
      profileImage
      joiningDate
      user {
        id
        firstName
        lastName
        email
      }
      department {
        id
        name
      }
      courses {
        id
        name
        code
      }
    }
  }
`;

export default async function StaffDirectoryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const client = createApolloClient();

  try {
    const { data } = await client.query<StaffData>({
      query: GET_STAFF_BY_DEPARTMENT,
      context: {
        headers: {
          Authorization: `JWT ${token}`
        }
      },
      fetchPolicy: "no-cache"
    });

    const staffMembers = data.staffByDepartment;

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-indigo-900">Department Staff Directory</h1>
                <p className="mt-2 text-gray-600">View and connect with faculty members in your department</p>
              </div>
              <div className="mt-4 md:mt-0 px-4 py-2 bg-indigo-100 rounded-lg text-indigo-700 font-medium">
                {staffMembers.length} {staffMembers.length === 1 ? 'Staff Member' : 'Staff Members'} Found
              </div>
            </div>
          </div>

          {/* Staff grid section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffMembers.map((staff) => (
              <Link 
                href={`/student/staff/${staff.id}`}
                key={staff.id}
                className="block transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6">
                    <div className="flex items-center">
                      <div className="relative w-16 h-16 rounded-full bg-white border-2 border-white shadow-md overflow-hidden flex-shrink-0">
                        {staff.profileImage ? (
                          <Image
                            src={`http://127.0.0.1:8000${staff.profileImage}`}
                            alt={`${staff.user.firstName}'s profile`}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                            <span className="text-lg font-medium text-gray-500">
                              {staff.user.firstName?.[0] || ""}
                              {staff.user.lastName?.[0] || ""}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-white font-semibold text-lg">
                          {staff.user.firstName} {staff.user.lastName}
                        </h2>
                        <p className="text-indigo-100 text-sm">
                          {staff.department.name}
                        </p>
                        {staff.isHod && (
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Head of Department
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{staff.user.email}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          Joined {new Date(staff.joiningDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })}
                        </span>
                      </div>
                    </div>

                    {staff.courses.length > 0 && (
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Teaching</h3>
                        <div className="flex flex-wrap gap-2">
                          {staff.courses.slice(0, 3).map((course) => (
                            <span
                              key={course.id}
                              className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md"
                            >
                              {course.code}
                            </span>
                          ))}
                          {staff.courses.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                              +{staff.courses.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      {staff.isHod ? 'Head of Department' : 'Faculty Member'}
                    </div>
                    <span className="inline-flex items-center text-sm font-medium text-indigo-600">
                      View Profile
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {staffMembers.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Staff Found</h3>
                <p className="text-gray-600 mb-6">There are currently no staff members in your department or you may not have access to view them.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching staff data:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Loading Failed</h3>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t load the staff directory. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }
}