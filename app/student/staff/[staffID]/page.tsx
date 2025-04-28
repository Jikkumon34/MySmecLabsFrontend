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

interface StaffDetailData {
  staffDetail: StaffProfile;
}

// GraphQL query
const GET_STAFF_DETAIL = gql`
  query GetStaffDetail($id: ID!) {
    staffDetail(id: $id) {
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

// Fix the type definition for params
interface PageProps {
  params: Promise<{
    staffID: string;
  }>;
}

export default async function StaffDetailPage({ params }: PageProps) {
  const { staffID } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const client = createApolloClient();

  try {
    const { data } = await client.query<StaffDetailData>({
      query: GET_STAFF_DETAIL,
      variables: {
        id: staffID
      },
      context: {
        headers: {
          Authorization: `JWT ${token}`
        }
      },
      fetchPolicy: "no-cache"
    });

    const staff = data.staffDetail;

    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center mb-6 text-sm">
            <Link href="/student/staff" className="text-blue-600 hover:text-blue-800 font-medium">
              Staff Directory
            </Link>
            <svg className="mx-2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-600 font-medium">
              {staff.user.firstName} {staff.user.lastName}
            </span>
          </nav>

          {/* Header section */}
          <div className="bg-white rounded-xl mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 h-28"></div>
            <div className="px-6 pt-0 pb-6 relative">
              <div className="flex flex-col md:flex-row">
                {/* Profile image */}
                <div className="relative -mt-12 mb-4 md:mb-0 flex-shrink-0">
                  <div className="relative h-24 w-24 rounded-full border-4 border-white bg-white">
                    {staff.profileImage ? (
                      <Image
                        src={`http://127.0.0.1:8000${staff.profileImage}`}
                        alt={`${staff.user.firstName}'s profile`}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded-full">
                        <span className="text-2xl font-medium text-blue-700">
                          {staff.user.firstName?.[0] || ""}
                          {staff.user.lastName?.[0] || ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Name and title */}
                <div className="md:ml-6 flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {staff.user.firstName} {staff.user.lastName}
                      </h1>
                      <p className="text-gray-600">{staff.department.name}</p>
                      {staff.isHod && (
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Head of Department
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <a
                        href={`mailto:${staff.user.email}`}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact via Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{staff.user.email}</span>
                  </div>
                </div>
              </div>
              
              {/* Staff Information */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Staff Information</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-500">Department</h3>
                    <p className="text-gray-800 font-medium">{staff.department.name}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-500">Joined</h3>
                    <p className="text-gray-800 font-medium">
                      {new Date(staff.joiningDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="text-gray-800 font-medium">
                      {staff.isHod ? "Head of Department" : "Faculty Member"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-500">Teaching</h3>
                    <p className="text-gray-800 font-medium">
                      {staff.courses.length} {staff.courses.length === 1 ? "Course" : "Courses"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content - Spans 2 columns on larger screens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Biography section */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Biography
                </h2>
                <div className="prose prose-blue max-w-none">
                  {staff.bio ? (
                    <p className="text-gray-700 leading-relaxed">{staff.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">No biography available for this staff member.</p>
                  )}
                </div>
              </div>

              {/* Courses section */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Teaching Courses
                </h2>
                
                {staff.courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {staff.courses.map((course) => (
                      <div 
                        key={course.id} 
                        className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-900">{course.name}</h3>
                            <p className="text-sm text-blue-600 font-medium mt-1">Code: {course.code}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center mt-4">
                    <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-gray-500">Not teaching any courses currently.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching staff detail:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl max-w-md text-center">
          <svg
            className="w-14 h-14 mx-auto text-red-500 mb-4"
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
          <h3 className="text-xl font-semibold mb-2">Staff Not Found</h3>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t load the staff details. The staff member may not exist or you may not have permission to view this profile.
          </p>
          <Link
            href="/student/staff"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Staff Directory
          </Link>
        </div>
      </div>
    );
  }
}