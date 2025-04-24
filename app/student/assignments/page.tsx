import { cookies } from "next/headers";
import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { redirect } from "next/navigation";
import Link from "next/link";

// Define TypeScript interfaces for GraphQL response data
interface StudentAssignment {
  id: string;
  status: string;
  content: string;
  submittedAt: string | null;
  grade: number | null;
  feedback: string | null;
  isLate: boolean;
  daysRemaining: number | null;
  isPastDue: boolean;
  assignmentDetails: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    maxMarks: number;
    course?: {
      id: string;
      name: string;
      code: string;
    };
  };
}

interface AssignmentCountsData {
  pending: number;
  inProgress: number;
  submitted: number;
  late: number;
  graded: number;
  total: number;
}

interface StudentAssignmentsData {
  studentAllAssignments: StudentAssignment[];
  studentAssignmentCounts: AssignmentCountsData;
}

// GraphQL query for student assignments with counts
const GET_ALL_STUDENT_ASSIGNMENTS = gql`
  query GetStudentAssignments(
    $courseId: ID,
    $batchId: ID,
    $search: String,
    $dueSoon: Boolean,
    $overdue: Boolean
  ) {
    studentAllAssignments(
      courseId: $courseId,
      batchId: $batchId,
      search: $search,
      dueSoon: $dueSoon,
      overdue: $overdue
    ) {
      id
      status
      content
      submittedAt
      grade
      feedback
      isLate
      daysRemaining
      isPastDue
      assignmentDetails {
        id
        title
        description
        dueDate
        maxMarks
        course {
          id
          name
          code
        }
      }
    }
    studentAssignmentCounts {
      pending
      inProgress
      submitted
      late
      graded
      total
    }
  }
`;

/** Helpers **/

function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
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
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "SUBMITTED":
      return "bg-green-100 text-green-800";
    case "LATE":
      return "bg-orange-100 text-orange-800";
    case "GRADED":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getUrgencyIndicator(
  daysRemaining: number | null,
  isPastDue: boolean
): { color: string; text: string } {
  if (isPastDue) {
    return { color: "text-red-600", text: "Overdue!" };
  }
  if (daysRemaining === null) {
    return { color: "text-gray-500", text: "No deadline" };
  }
  if (daysRemaining <= 1) {
    return { color: "text-red-600", text: "Due today!" };
  } else if (daysRemaining <= 3) {
    return { color: "text-orange-500", text: `${daysRemaining} days left` };
  } else if (daysRemaining <= 7) {
    return { color: "text-yellow-600", text: `${daysRemaining} days left` };
  } else {
    return { color: "text-green-600", text: `${daysRemaining} days left` };
  }
}

function truncateDescription(
  description: string,
  maxLength: number = 150
): string {
  return description.length <= maxLength
    ? description
    : description.substring(0, maxLength) + "...";
}

/**
 * Student Assignments Page
 */
export default async function StudentAssignments({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // 1. Await the lazy searchParams
  const params = await searchParams;

  // 2. Pull out and normalize each filter
  const rawCourseId  = params.courseId;
  const rawBatchId   = params.batchId;
  const rawSearch    = params.search;
  const rawDueSoon   = params.dueSoon;
  const rawOverdue   = params.overdue;
  const rawStatus    = params.status;

  const courseId     = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId;
  const batchId      = Array.isArray(rawBatchId)  ? rawBatchId[0]  : rawBatchId;
  const search       = Array.isArray(rawSearch)   ? rawSearch[0]   : rawSearch;
  const dueSoon      = rawDueSoon === "true";
  const overdue      = rawOverdue === "true";
  const statusFilter = Array.isArray(rawStatus)   ? rawStatus[0]   : rawStatus;

  // 3. Authentication
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  // 4. Fetch data
  const client = createApolloClient();
  try {
    const { data } = await client.query<StudentAssignmentsData>({
      query: GET_ALL_STUDENT_ASSIGNMENTS,
      variables: {
        courseId,
        batchId,
        search,
        dueSoon,
        overdue,
      },
      context: {
        headers: { Authorization: `JWT ${token}` },
      },
      fetchPolicy: "no-cache",
    });
    

    // 5. Apply status‐only filter if provided
    let assignments = data.studentAllAssignments;
    if (statusFilter && statusFilter !== "ALL") {
      assignments = assignments.filter((a) => a.status === statusFilter);
    }
    const counts = data.studentAssignmentCounts;

    // 6. Render
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold text-[#2E3192] mb-6">My Assignments</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: "All",       count: counts.total,     status: undefined,        color: null },
            { label: "Pending",   count: counts.pending,   status: "PENDING",       color: "yellow" },
            { label: "In Progress", count: counts.inProgress, status: "IN_PROGRESS", color: "blue"   },
            { label: "Submitted", count: counts.submitted, status: "SUBMITTED",     color: "green"  },
            { label: "Late",      count: counts.late,      status: "LATE",          color: "orange" },
            { label: "Graded",    count: counts.graded,    status: "GRADED",        color: "purple" },
          ].map(({ label, count, status, color }) => {
            const isActive = statusFilter === status || (status === undefined && !statusFilter);
            const ringClass = isActive ? "ring-2 ring-[#2E3192]" : "";
            const textColor = color ? `text-${color}-600` : "text-gray-700";
            return (
              <Link
                key={label}
                href={`/student/assignments${status ? `?status=${status}` : ""}`}
                className={`bg-white rounded-lg shadow p-3 text-center hover:shadow-md transition-shadow ${ringClass}`}
              >
                <div className={`text-2xl font-bold ${textColor}`}>{count}</div>
                <div className={`text-sm ${textColor}`}>{label}</div>
              </Link>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Filters</h2>
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-600 mb-1">
                Search
              </label>
              <input
                type="text"
                name="search"
                id="search"
                defaultValue={search}
                placeholder="Search assignments..."
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#2E3192] focus:border-[#2E3192]"
              />
            </div>
            <div className="flex items-center space-x-4 mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="dueSoon"
                  defaultChecked={dueSoon}
                  className="h-4 w-4 text-[#2E3192] focus:ring-[#2E3192] border-gray-300 rounded"
                />
                <span className="ml-2 block text-sm text-gray-600">Due Soon</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="overdue"
                  defaultChecked={overdue}
                  className="h-4 w-4 text-[#2E3192] focus:ring-[#2E3192] border-gray-300 rounded"
                />
                <span className="ml-2 block text-sm text-gray-600">Overdue</span>
              </label>
            </div>
            <div className="sm:col-span-2 lg:col-span-1 flex justify-end items-end">
              <button
                type="submit"
                className="bg-[#2E3192] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#0071BC] p-4 text-white">
            <h2 className="text-xl font-semibold">
              {statusFilter
                ? `${statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()} Assignments`
                : "All Assignments"}
            </h2>
          </div>
          <div className="p-4">
            {assignments.length > 0 ? (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <Link
                    key={assignment.id}
                    href={`/student/assignments/${assignment.id}`}
                    className="block border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row p-4">
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-[#2E3192]">
                            {assignment.assignmentDetails.title}
                          </h3>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusClass(
                              assignment.status
                            )}`}
                          >
                            {assignment.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {assignment.assignmentDetails.course?.name || "No Course"} –{" "}
                          {assignment.assignmentDetails.course?.code || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {truncateDescription(assignment.assignmentDetails.description)}
                        </p>
                      </div>
                      <div className="flex flex-row md:flex-col justify-between md:justify-center items-end md:items-center md:ml-6 mt-4 md:mt-0 md:min-w-24">
                        <div className="text-sm text-gray-500">
                          Due: {formatDate(assignment.assignmentDetails.dueDate)}
                        </div>
                        {assignment.status !== "GRADED" &&
                          assignment.status !== "SUBMITTED" && (
                            <div
                              className={`text-sm font-medium ${getUrgencyIndicator(
                                assignment.daysRemaining,
                                assignment.isPastDue
                              ).color}`}
                            >
                              {getUrgencyIndicator(
                                assignment.daysRemaining,
                                assignment.isPastDue
                              ).text}
                            </div>
                          )}
                        {assignment.grade !== null && (
                          <div className="text-sm font-medium mt-1">
                            Grade:{" "}
                            <span className="text-blue-600">
                              {assignment.grade}/{assignment.assignmentDetails.maxMarks}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 mt-2">
                  No assignments found with the selected filters.
                </p>
                <Link href="/student/assignments" className="text-[#2E3192] hover:underline mt-2 inline-block">
                  View all assignments
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching student assignments:", error);
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
          <h3 className="text-lg font-semibold text-gray-900 mt-4">Unable to load assignments</h3>
          <p className="text-gray-600 mt-2">
            There was an error loading your assignments. Please try again later or contact support.
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
