// app/dashboard/page.tsx
import React from 'react';
import { cookies } from "next/headers";
import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import Link from "next/link";

// TypeScript interfaces for GraphQL schema
interface Instructor {
  user: {
    firstName: string;
    lastName: string;
  };
}

interface UpcomingSchedule {
  id: string;
  sessionDate: string;
  sessionTitle: string;
  sessionDescription: string;
  instructor: Instructor;
}

interface CourseProgress {
  courseId: string;
  name: string;
  progress: number;
}

interface StudentProfile {
  firstName: string;
  lastName: string;
}

interface StudentReferral {
  referralCode: string;
  referralCount: number;
  successfulReferrals: number;
  pendingReferrals: number;
}

interface DashboardData {
  activeCoursesCount: number;
  completedCoursesCount: number;
  pendingAssignmentsCount: number;
  averageGrade: number;
  overallProgress: number;
  courseProgresses: CourseProgress[];
  upcomingSchedules: UpcomingSchedule[];
  studentProfile: StudentProfile;
  studentReferral: StudentReferral;
}

// GraphQL query
const GET_DASHBOARD_DATA = gql`
  query {
    activeCoursesCount
    completedCoursesCount
    pendingAssignmentsCount
    averageGrade
    overallProgress
    courseProgresses {
      courseId
      name
      progress
    }
    upcomingSchedules {
      id
      sessionDate
      sessionTitle
      sessionDescription
      instructor {
        user {
          firstName
          lastName
        }
      }
    }
    studentProfile {
      firstName
      lastName
    }
    studentReferral {
      referralCode
      referralCount
      successfulReferrals
      pendingReferrals
    }
  }
`;

// Main component
export default async function StudentDashboard() {
  const cookieStore = await cookies();
  const tokenInCookie = cookieStore.get("token")?.value;
  const client = createApolloClient();

  try {
    const { data } = await client.query<{ 
      activeCoursesCount: number;
      completedCoursesCount: number;
      pendingAssignmentsCount: number;
      averageGrade: number;
      overallProgress: number;
      courseProgresses: CourseProgress[];
      upcomingSchedules: UpcomingSchedule[];
      studentProfile: StudentProfile;
      studentReferral: StudentReferral;
    }>({
      query: GET_DASHBOARD_DATA,
      context: {
        headers: {
          Authorization: tokenInCookie ? `JWT ${tokenInCookie}` : "",
        },
      },
      fetchPolicy: "no-cache",
    });
    
    // Type the dashboard data correctly using our interface
    const dashboardData: DashboardData = data || {
      activeCoursesCount: 0,
      completedCoursesCount: 0,
      pendingAssignmentsCount: 0,
      averageGrade: 0,
      overallProgress: 0,
      courseProgresses: [],
      upcomingSchedules: [],
      studentProfile: { firstName: '', lastName: '' },
      studentReferral: { referralCode: '', referralCount: 0, successfulReferrals: 0, pendingReferrals: 0 }
    };

    console.log("Dashboard Data:", dashboardData);
    
    // Extract data
    const { 
      activeCoursesCount,
      completedCoursesCount,
      pendingAssignmentsCount,
      averageGrade,
      overallProgress,
      courseProgresses,
      upcomingSchedules,
      studentProfile,
      studentReferral
    } = dashboardData;

    // Create initials from name
    const initials = studentProfile.firstName?.[0] || studentProfile.lastName?.[0] || "S";
    const fullName = `${studentProfile.firstName} ${studentProfile.lastName}`;

    return (
      <div className="bg-gray-50 font-sans overflow-x-hidden">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, {studentProfile.firstName}! Here&apos;s your learning progress.</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow">
                Request Help
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 shadow-sm hover:shadow">
                <i className="fas fa-cog mr-1"></i> Settings
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Card */}
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="text-sm text-gray-500 mb-1">Active Courses</div>
                  <div className="text-2xl font-bold text-gray-800">{activeCoursesCount}</div>
                  <div className="text-xs text-green-500 mt-1 flex items-center">
                    <i className="fas fa-arrow-up mr-1"></i> Keep up the good work!
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="text-sm text-gray-500 mb-1">Completed Courses</div>
                  <div className="text-2xl font-bold text-gray-800">{completedCoursesCount}</div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center">
                    <i className="fas fa-check mr-1"></i> Graduation progress
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="text-sm text-gray-500 mb-1">Pending Assignments</div>
                  <div className="text-2xl font-bold text-indigo-600">{pendingAssignmentsCount}</div>
                  <div className="text-xs text-orange-500 mt-1 flex items-center">
                    <i className="fas fa-clock mr-1"></i> Needs attention
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="text-sm text-gray-500 mb-1">Average Grade</div>
                  <div className="text-2xl font-bold text-green-600">{averageGrade}%</div>
                  <div className="text-xs text-green-500 mt-1 flex items-center">
                    <i className="fas fa-arrow-up mr-1"></i> Keep improving!
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Academic Progress</h2>
                    <p className="text-sm text-gray-500">Overall course completion</p>
                  </div>
                </div>
                <div className="w-full max-w-xl mx-auto">
                  {/* Simple horizontal progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-indigo-600 h-4 rounded-full"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <div className="text-center text-xl font-bold text-gray-800 mt-2">
                    {overallProgress}%
                  </div>
                </div>
              </div>

              {/* Course Progress Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseProgresses.map((course: CourseProgress) => (
                  <div key={course.courseId} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                        <i className="fas fa-code text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{course.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">Course ID: {course.courseId}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium text-gray-800">{course.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {courseProgresses.length === 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 col-span-2 text-center">
                    <p className="text-gray-500">No active course progresses available.</p>
                  </div>
                )}
              </div>

              {/* Assignments Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Assignments &amp; Deadlines</h2>
                    <p className="text-sm text-gray-500">Track your upcoming work and submissions</p>
                  </div>
                  <div className="flex space-x-2 mt-3 md:mt-0">
                    <select className="text-sm border rounded-lg px-3 py-1.5 bg-gray-50">
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>Submitted</option>
                      <option>Graded</option>
                    </select>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                      <i className="fas fa-sort mr-1"></i> Sort
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingAssignmentsCount > 0 ? (
                        <>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">Python Assignment 1</div>
                              <div className="text-xs text-gray-500">Basic Functions & Variables</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Python Full Stack</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-red-500">May 3, 2025</div>
                              <div className="text-xs text-gray-500">6 days left</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">In Progress</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">—</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors duration-200">Submit</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">Frontend Quiz</div>
                              <div className="text-xs text-gray-500">HTML & CSS Basics</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Python Full Stack</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">May 10, 2025</div>
                              <div className="text-xs text-gray-500">13 days left</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Pending</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">—</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg transition-colors duration-200">Start</button>
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            No pending assignments at the moment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 bg-gray-50 text-right">
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto">
                    View all assignments <i className="fas fa-arrow-right ml-1 text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              {/* Profile Stats */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/70">
                    <span className="text-xl font-bold">{initials}</span>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold">{fullName}</h2>
                    <p className="text-indigo-100">Full Stack Development</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="text-center p-2 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold">{averageGrade}%</div>
                    <div className="text-xs text-indigo-100">Avg. Grade</div>
                  </div>
                  <div className="text-center p-2 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold">{activeCoursesCount + completedCoursesCount}</div>
                    <div className="text-xs text-indigo-100">Courses</div>
                  </div>
                  <div className="text-center p-2 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-indigo-100">Certificates</div>
                  </div>
                </div>
                <button className="mt-4 bg-white/20 hover:bg-white/30 text-white w-full py-2 rounded-lg text-sm transition-colors duration-200">
                  View Full Profile
                </button>
              </div>

              {/* Upcoming Schedule */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming Schedule</h2>
                <div className="space-y-3">
                  {upcomingSchedules.length > 0 ? (
                    upcomingSchedules.map((schedule: UpcomingSchedule) => (
                      <div key={schedule.id} className="flex p-3 rounded-lg border-l-4 border-indigo-500 bg-indigo-50">
                        <div className="mr-4 flex flex-col items-center justify-center">
                          <div className="text-xs font-bold bg-indigo-100 text-indigo-800 rounded-md px-2 py-1 mb-1">
                            {new Date(schedule.sessionDate).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                          </div>
                          <div className="text-sm font-medium">
                            {new Date(schedule.sessionDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">{schedule.sessionTitle}</div>
                          <div className="text-xs text-gray-500">{schedule.sessionDescription}</div>
                          {schedule.instructor && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <i className="fas fa-user-circle text-indigo-400 mr-1"></i> 
                              {schedule.instructor.user.firstName} {schedule.instructor.user.lastName}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex p-3 rounded-lg border-l-4 border-indigo-500 bg-indigo-50">
                        <div className="mr-4 flex flex-col items-center justify-center">
                          <div className="text-xs font-bold bg-indigo-100 text-indigo-800 rounded-md px-2 py-1 mb-1">TODAY</div>
                          <div className="text-sm font-medium">14:00</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">Python Full Stack - Session 1</div>
                          <div className="text-xs text-gray-500">Introduction to Python</div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <i className="fas fa-user-circle text-indigo-400 mr-1"></i> Dr. Jane Wilson
                          </div>
                        </div>
                      </div>
                      <div className="flex p-3 rounded-lg border-l-4 border-gray-300 bg-gray-50">
                        <div className="mr-4 flex flex-col items-center justify-center">
                          <div className="text-xs font-bold bg-gray-200 text-gray-600 rounded-md px-2 py-1 mb-1">WED</div>
                          <div className="text-sm font-medium">10:00</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-800">Python Full Stack - Session 2</div>
                          <div className="text-xs text-gray-500">Data Structures</div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <i className="fas fa-user-circle text-gray-400 mr-1"></i> Prof. Alan Smith
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto">
                    View full calendar <i className="fas fa-arrow-right ml-1 text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Skills Development */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Skills Development</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {/* Python */}
                  <div>
                    <div className="text-xs font-medium text-gray-800 mb-1">Python</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '20%' }} />
                    </div>
                    <div className="text-xs text-gray-500">20%</div>
                  </div>
                  {/* React */}
                  <div>
                    <div className="text-xs font-medium text-gray-800 mb-1">HTML/CSS</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }} />
                    </div>
                    <div className="text-xs text-gray-500">10%</div>
                  </div>
                  {/* SQL */}
                  <div>
                    <div className="text-xs font-medium text-gray-800 mb-1">Django</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '5%' }} />
                    </div>
                    <div className="text-xs text-gray-500">5%</div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-medium text-gray-800 mb-2">Recommended Skill</div>
                  <div className="flex bg-blue-50 rounded-lg p-3 items-center">
                    <div className="w-10 h-10 mr-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white">
                      <i className="fas fa-code"></i>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">JavaScript Fundamentals</div>
                      <div className="text-xs text-gray-500">Essential for full-stack development</div>
                    </div>
                    <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">Explore</button>
                  </div>
                </div>
              </div>

              {/* Referral Program */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Referral Program</h2>
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-600 mb-2">Your referral code:</div>
                  <div className="flex">
                    <input
                      type="text"
                      value={studentReferral.referralCode}
                      className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 bg-white text-gray-800 focus:outline-none"
                      readOnly
                    />
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-200">
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm font-medium text-gray-600">Friends referred</div>
                  <div className="text-lg font-bold text-gray-800">{studentReferral.referralCount}</div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-medium text-gray-600">Rewards earned</div>
                  <div className="text-lg font-bold text-green-600">${studentReferral.successfulReferrals * 25}</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full" 
                    style={{ width: `${(studentReferral.referralCount / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-center mb-4">
                  {studentReferral.referralCount} of 5 referrals needed for next reward tier
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium w-full transition-colors duration-200 shadow-sm hover:shadow">
                  <i className="fas fa-share-alt mr-1"></i> Invite Friends
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-medium text-gray-900">Unable to Load Dashboard</h3>
          <p className="mt-3 text-gray-600">
            There was an error loading your student dashboard. Please try again later or contact support if the issue persists.
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