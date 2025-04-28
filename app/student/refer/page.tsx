import { cookies } from "next/headers";
import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, CheckCircle, Clock, Share2 } from "lucide-react";
import ReferralActionsClient  from "@/components/students/ReferralActionsClient";

// Define TypeScript interfaces for GraphQL response data
interface Referral {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  requestedCourse?: {
    name: string;
  };
  department?: {
    name: string;
  };
  registrationDate: string;
  status: string;
  statusDisplay: string;
}

interface StudentReferralData {
  studentReferral: {
    referralCode: string;
    referralCount: number;
    successfulReferrals: number;
    pendingReferrals: number;
    referralsList: Referral[];
  };
}

// GraphQL query for student referral data
const GET_STUDENT_REFERRAL_DATA = gql`
  query GetStudentReferralData {
    studentReferral {
      referralCode
      referralCount
      successfulReferrals
      pendingReferrals
      referralsList {
        id
        fullName
        phone
        email
        requestedCourse {
          name
        }
        department {
          name
        }
        registrationDate
        status
        statusDisplay
      }
    }
  }
`;

/** Helpers **/
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusClass(status: string): string {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "COMPLETED":
      return "bg-blue-100 text-blue-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Student Refer & Earn Page
 */
export default async function StudentReferral() {
  // 1. Authentication
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  // 2. Fetch data
  const client = createApolloClient();
  try {
    const { data } = await client.query<StudentReferralData>({
      query: GET_STUDENT_REFERRAL_DATA,
      context: {
        headers: { Authorization: `JWT ${token}` },
      },
      fetchPolicy: "no-cache",
    });

    const referralData = data.studentReferral;

    // 3. Render
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold text-[#2E3192] mb-6">Refer & Earn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Referral Code Card */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#2E3192] to-[#0071BC] p-6">
              <h2 className="text-xl font-bold text-white">Your Referral Code</h2>
              <p className="text-blue-100 text-sm mt-1">
                Share this code with friends and earn rewards
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-xl font-mono font-bold text-[#2E3192]">
                  {referralData.referralCode}
                </div>
                {/* Client component for copy functionality */}
                <ReferralActionsClient 
                  referralCode={referralData.referralCode} 
                />
              </div>
              
              <div className="mt-6">
                <Link href={`/student/refer/share?code=${referralData.referralCode}`} className="w-full flex items-center justify-center gap-2 bg-[#2E3192] text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  <Share2 size={18} />
                  <span>Share My Referral Code</span>
                </Link>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">How It Works</h3>
                <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
                  <li>Share your unique referral code with friends</li>
                  <li>They register using your code</li>
                  <li>When they enroll in a course, you earn rewards</li>
                  <li>Track all your referrals on this page</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Stats & Referral Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Total Referrals</div>
                    <div className="text-2xl font-bold text-gray-800">{referralData.referralCount}</div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users size={24} className="text-[#2E3192]" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Successful</div>
                    <div className="text-2xl font-bold text-green-600">{referralData.successfulReferrals}</div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Pending</div>
                    <div className="text-2xl font-bold text-yellow-600">{referralData.pendingReferrals}</div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Clock size={24} className="text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Referral Form */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#0071BC] p-4 text-white">
                <h2 className="text-lg font-semibold">Refer Someone Now</h2>
              </div>
              <div className="p-6">
                <form action="/api/referrals/create" method="POST" className="space-y-4">
                  <input type="hidden" name="referralCode" value={referralData.referralCode} />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="friendName" className="block text-sm font-medium text-gray-700 mb-1">
                        Friend&apos;s Name
                      </label>
                      <input
                        type="text"
                        id="friendName"
                        name="friendName"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#2E3192] focus:border-[#2E3192]"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="friendPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="friendPhone"
                        name="friendPhone"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#2E3192] focus:border-[#2E3192]"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="friendEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="friendEmail"
                      name="friendEmail"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#2E3192] focus:border-[#2E3192]"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                        Interested Course
                      </label>
                      <select
                        id="courseId"
                        name="courseId"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#2E3192] focus:border-[#2E3192]"
                      >
                        <option value="">Select a course</option>
                        <option value="web-development">Web Development</option>
                        <option value="data-science">Data Science</option>
                        <option value="cyber-security">Cyber Security</option>
                        <option value="ai-ml">AI & Machine Learning</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        id="departmentId"
                        name="departmentId"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#2E3192] focus:border-[#2E3192]"
                      >
                        <option value="">Select a department</option>
                        <option value="it">Information Technology</option>
                        <option value="cse">Computer Science</option>
                        <option value="ece">Electronics & Communication</option>
                        <option value="mech">Mechanical Engineering</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#2E3192] text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Submit Referral
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Referrals List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#0071BC] p-4 text-white flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Referrals</h2>
            <div className="text-sm">
              Total: <span className="font-semibold">{referralData.referralCount}</span>
            </div>
          </div>
          
          <div className="p-4">
            {referralData.referralsList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {referralData.referralsList.map((referral) => (
                      <tr key={referral.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{referral.fullName}</div>
                          <div className="text-xs text-gray-500">
                            {referral.department?.name || "No Department"}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm">{referral.email}</div>
                          <div className="text-xs text-gray-500">{referral.phone}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {referral.requestedCourse?.name || "Not specified"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(referral.registrationDate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                              referral.status
                            )}`}
                          >
                            {referral.statusDisplay}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-gray-500 mt-2">You haven&apos;t made any referrals yet.</p>
                <p className="text-sm text-gray-500 mt-1">
                  Share your referral code with friends to start earning rewards!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rewards Information */}
        <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#0071BC] p-4 text-white">
            <h2 className="text-xl font-semibold">Rewards Program</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                  <span className="text-[#2E3192] font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Refer Friends</h3>
                <p className="text-gray-600 text-sm">
                  Share your unique referral code with friends interested in our courses
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                  <span className="text-[#2E3192] font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Friends Enroll</h3>
                <p className="text-gray-600 text-sm">
                  When your friends successfully enroll in any of our courses
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                  <span className="text-[#2E3192] font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Both Earn Rewards</h3>
                <p className="text-gray-600 text-sm">
                  You get ₹500 credit and your friend gets ₹250 off their course fee
                </p>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-700 mb-3">Terms & Conditions</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Rewards are credited after your referral completes at least 30 days of the course</li>
                <li>Maximum rewards capped at ₹5000 per semester</li>
                <li>Credits can be used for future courses or withdrawn</li>
                <li>Program terms subject to change with notification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching student referral data:", error);
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
          <h3 className="text-lg font-semibold text-gray-900 mt-4">Unable to load referral data</h3>
          <p className="text-gray-600 mt-2">
            There was an error loading your referral information. Please try again later or contact support.
          </p>
          <div className="mt-6">
            <Link
              href="/student/dashboard"
              className="inline-block bg-[#2E3192] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
}