// app/dashboard/page.tsx
import React from 'react';
import ProgressPie from '@/components/students/ProgressPie';

// This is a Server Component
export default async function StudentDashboard() {
  // Data that would typically come from your database in a real app
  const progressData = {
    completed: 75,
    remaining: 25
  };

  return (
    <div className="bg-gray-50 font-sans overflow-x-hidden">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, John! Here&apos;s your learning progress.</p>
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
                <div className="text-2xl font-bold text-gray-800">4</div>
                <div className="text-xs text-green-500 mt-1 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i> 1 more than last semester
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="text-sm text-gray-500 mb-1">Completed Courses</div>
                <div className="text-2xl font-bold text-gray-800">7</div>
                <div className="text-xs text-gray-400 mt-1 flex items-center">
                  <i className="fas fa-check mr-1"></i> All requirements met
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="text-sm text-gray-500 mb-1">Pending Assignments</div>
                <div className="text-2xl font-bold text-indigo-600">5</div>
                <div className="text-xs text-orange-500 mt-1 flex items-center">
                  <i className="fas fa-clock mr-1"></i> 2 due this week
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="text-sm text-gray-500 mb-1">Average Grade</div>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <div className="text-xs text-green-500 mt-1 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i> 3% from last term
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
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <ProgressPie completed={progressData.completed} />
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-800">
                    {progressData.completed}%
                  </div>
                </div>
              </div>
            </div>

            {/* Course Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <i className="fas fa-code text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">Python API Development</h3>
                    <p className="text-sm text-gray-500 mb-3">Backend Programming</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div className="bg-blue-600 h-2.5 rounded-full w-3/4"></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-800">75%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                    <i className="fas fa-laptop-code text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">React Module</h3>
                    <p className="text-sm text-gray-500 mb-3">Frontend Development</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div className="bg-indigo-600 h-2.5 rounded-full w-2/5"></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-800">40%</span>
                    </div>
                  </div>
                </div>
              </div>
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Build REST API</div>
                        <div className="text-xs text-gray-500">Backend Module</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Python API</td>
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
                        <div className="text-sm font-medium text-gray-900">Frontend Module Quiz</div>
                        <div className="text-xs text-gray-500">Components Section</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">React Module</td>
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Database Design Project</div>
                        <div className="text-xs text-gray-500">Final Project</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SQL Fundamentals</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">Apr 25, 2025</div>
                        <div className="text-xs text-gray-500">2 days ago</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Submitted</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">—</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg transition-colors duration-200">View</button>
                      </td>
                    </tr>
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
                  <span className="text-xl font-bold">JS</span>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">John Smith</h2>
                  <p className="text-indigo-100">Software Development</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-center p-2 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-xs text-indigo-100">Avg. Grade</div>
                </div>
                <div className="text-center p-2 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold">11</div>
                  <div className="text-xs text-indigo-100">Courses</div>
                </div>
                <div className="text-center p-2 bg-white/10 rounded-lg">
                  <div className="text-2xl font-bold">32</div>
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
                <div className="flex p-3 rounded-lg border-l-4 border-indigo-500 bg-indigo-50">
                  <div className="mr-4 flex flex-col items-center justify-center">
                    <div className="text-xs font-bold bg-indigo-100 text-indigo-800 rounded-md px-2 py-1 mb-1">TODAY</div>
                    <div className="text-sm font-medium">14:00</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Python API - Session 4</div>
                    <div className="text-xs text-gray-500">Authentication &amp; Security</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <i className="fas fa-user-circle text-indigo-400 mr-1"></i> Dr. Jane Wilson
                    </div>
                  </div>
                </div>
                <div className="flex p-3 rounded-lg border-l-4 border-gray-300 bg-gray-50">
                  <div className="mr-4 flex flex-col items-center justify-center">
                    <div className="text-xs font-bold bg-gray-200 text-gray-600 rounded-md px-2 py-1 mb-1">TUE</div>
                    <div className="text-sm font-medium">10:00</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">React Module - Components</div>
                    <div className="text-xs text-gray-500">Functional vs Class Components</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <i className="fas fa-user-circle text-gray-400 mr-1"></i> Prof. Alan Smith
                    </div>
                  </div>
                </div>
                <div className="flex p-3 rounded-lg border-l-4 border-gray-300 bg-gray-50">
                  <div className="mr-4 flex flex-col items-center justify-center">
                    <div className="text-xs font-bold bg-gray-200 text-gray-600 rounded-md px-2 py-1 mb-1">THU</div>
                    <div className="text-sm font-medium">13:00</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">SQL Fundamentals - Lab</div>
                    <div className="text-xs text-gray-500">Advanced Queries Workshop</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <i className="fas fa-user-circle text-gray-400 mr-1"></i> Dr. Mark Davis
                    </div>
                  </div>
                </div>
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
                <div className="text-center">
                  <div className="relative mx-auto w-16 h-16 mb-2">
                    <div className="absolute inset-0">
                      <ProgressPie completed={80} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-indigo-600">80%</div>
                  </div>
                  <div className="text-xs font-medium text-gray-800">Python</div>
                </div>
                {/* React */}
                <div className="text-center">
                  <div className="relative mx-auto w-16 h-16 mb-2">
                    <div className="absolute inset-0">
                      <ProgressPie completed={60} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-blue-600">60%</div>
                  </div>
                  <div className="text-xs font-medium text-gray-800">React</div>
                </div>
                {/* SQL */}
                <div className="text-center">
                  <div className="relative mx-auto w-16 h-16 mb-2">
                    <div className="absolute inset-0">
                      <ProgressPie completed={90} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-green-600">90%</div>
                  </div>
                  <div className="text-xs font-medium text-gray-800">SQL</div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="font-medium text-gray-800 mb-2">Recommended Skill</div>
                <div className="flex bg-blue-50 rounded-lg p-3 items-center">
                  <div className="w-10 h-10 mr-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white">
                    <i className="fas fa-cloud"></i>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">AWS Cloud Services</div>
                    <div className="text-xs text-gray-500">Complement your backend skills</div>
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
                  <input type="text" value="JOHN2025"
                         className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 bg-white text-gray-800 focus:outline-none"
                         readOnly />
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-200">
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-medium text-gray-600">Friends referred</div>
                <div className="text-lg font-bold text-gray-800">3</div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium text-gray-600">Rewards earned</div>
                <div className="text-lg font-bold text-green-600">$75</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                <div className="bg-indigo-600 h-1.5 rounded-full w-3/5"></div>
              </div>
              <div className="text-xs text-gray-500 text-center mb-4">3 of 5 referrals needed for next reward tier</div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium w-full transition-colors duration-200 shadow-sm hover:shadow">
                <i className="fas fa-share-alt mr-1"></i> Invite Friends
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}