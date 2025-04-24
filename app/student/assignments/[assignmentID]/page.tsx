import { cookies } from "next/headers";
import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { redirect } from "next/navigation";
import Link from "next/link";

// Define TypeScript interfaces for GraphQL response data
interface AssignmentAttachment {
  id: string;
  file: string;
  uploadedAt: string;
}

interface SubmissionAttachment {
  id: string;
  file: string;
  uploadedAt: string;
}

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
  assignmentAttachments: AssignmentAttachment[];
  submissionAttachments: SubmissionAttachment[];
}

interface AssignmentDetailData {
  studentAssignmentDetail: StudentAssignment;
}


interface PageProps {
    params:  Promise<{
        assignmentID: string;
    }>;
  }

// GraphQL query for student assignment detail
const GET_ASSIGNMENT_DETAIL = gql`
  query GetStudentAssignmentDetail($id: ID!) {
    studentAssignmentDetail(id: $id) {
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
      assignmentAttachments {
        id
        file
        uploadedAt
      }
      submissionAttachments {
        id
        file
        uploadedAt
      }
    }
  }
`;

/**
 * Format a date string into a user-friendly format
 */
function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get the appropriate CSS class for a status label
 */
function getStatusClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800';
    case 'SUBMITTED':
      return 'bg-green-100 text-green-800';
    case 'LATE':
      return 'bg-orange-100 text-orange-800';
    case 'GRADED':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get the file extension from a path
 */
function getFileExtension(filePath: string): string {
  return filePath.split('.').pop()?.toLowerCase() || '';
}

/**
 * Get appropriate icon and color based on file type
 */
function getFileIcon(filePath: string): { icon: string, color: string } {
  const ext = getFileExtension(filePath);
  
  switch (ext) {
    case 'pdf':
      return { 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>`, 
        color: 'text-red-600' 
      };
    case 'doc':
    case 'docx':
      return { 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>`, 
        color: 'text-blue-600' 
      };
    case 'xls':
    case 'xlsx':
      return { 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>`, 
        color: 'text-green-600' 
      };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return { 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>`, 
        color: 'text-purple-600' 
      };
    case 'zip':
    case 'rar':
      return { 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>`, 
        color: 'text-yellow-600' 
      };
    default:
      return { 
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>`, 
        color: 'text-gray-600' 
      };
  }
}

/**
 * Get file name from path
 */
function getFileName(filePath: string): string {
  return filePath.split('/').pop() || filePath;
}

/**
 * Individual Assignment Detail Page
 */
export default async function AssignmentDetail({ params }: PageProps) {
  const {assignmentID} = await params;

  
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
    const { data } = await client.query<AssignmentDetailData>({
      query: GET_ASSIGNMENT_DETAIL,
      variables: {
        id: assignmentID
      },
      context: {
        headers: {
          Authorization: `JWT ${token}`
        },
      },
      fetchPolicy: "no-cache"
    });
    
    const assignment = data.studentAssignmentDetail;
    
    if (!assignment) {
      return (
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800">Assignment not found</h2>
            <p className="text-gray-600 mt-2">The assignment you are looking for does not exist or you don&apos;t have access.</p>
            <Link href="/student/assignments" className="inline-block mt-4 bg-[#2E3192] text-white px-4 py-2 rounded-md">
              Back to Assignments
            </Link>
          </div>
        </div>
      );
    }
    
    // Calculate percentage if grade exists
    const gradePercentage = assignment.grade !== null 
      ? Math.round((assignment.grade / assignment.assignmentDetails.maxMarks) * 100) 
      : null;
    
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <Link href="/student/assignments" className="text-[#2E3192] hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Assignments
            </Link>
            <h1 className="text-2xl font-bold text-[#2E3192] mt-2">{assignment.assignmentDetails.title}</h1>
          </div>
          <div className="mt-2 md:mt-0">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(assignment.status)}`}>
              {assignment.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Details */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#0071BC] p-4 text-white">
                <h2 className="text-xl font-semibold">Assignment Details</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: assignment.assignmentDetails.description }}></div>
                
                {/* Assignment Attachments */}
                {assignment.assignmentAttachments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Assignment Resources</h3>
                    <div className="space-y-2">
                      {assignment.assignmentAttachments.map((attachment) => {
                        const { icon, color } = getFileIcon(attachment.file);
                        return (
                          <a 
                            key={attachment.id}
                            href={`http://127.0.0.1:8000/media/${attachment.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 border rounded-md hover:bg-gray-50"
                          >
                            <div className={`mr-3 ${color}`} dangerouslySetInnerHTML={{ __html: icon }}></div>
                            <div>
                              <p className="font-medium">{getFileName(attachment.file)}</p>
                              <p className="text-sm text-gray-500">Uploaded {formatDate(attachment.uploadedAt)}</p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Submission Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#0071BC] p-4 text-white">
                <h2 className="text-xl font-semibold">Your Submission</h2>
              </div>
              <div className="p-4 md:p-6">
                {assignment.submittedAt ? (
                  <>
                    <div className="mb-4">
                      <p className="text-gray-600">
                        <span className="font-medium">Submitted:</span> {formatDate(assignment.submittedAt)}
                        {assignment.isLate && (
                          <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Late</span>
                        )}
                      </p>
                    </div>
                    
                    {assignment.content && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Your Answer</h3>
                        <div className="bg-gray-50 p-4 rounded-md border">
                          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: assignment.content }}></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Submission Attachments */}
                    {assignment.submissionAttachments.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Your Attachments</h3>
                        <div className="space-y-2">
                          {assignment.submissionAttachments.map((attachment) => {
                            const { icon, color } = getFileIcon(attachment.file);
                            return (
                              <a 
                                key={attachment.id}
                                href={attachment.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-3 border rounded-md hover:bg-gray-50"
                              >
                                <div className={`mr-3 ${color}`} dangerouslySetInnerHTML={{ __html: icon }}></div>
                                <div>
                                  <p className="font-medium">{getFileName(attachment.file)}</p>
                                  <p className="text-sm text-gray-500">Uploaded {formatDate(attachment.uploadedAt)}</p>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Grade and Feedback */}
                    {assignment.grade !== null && (
                      <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Grade</h3>
                        <div className="flex items-center mb-2">
                          <div className="text-2xl font-bold text-green-800">{assignment.grade} / {assignment.assignmentDetails.maxMarks}</div>
                          <div className="ml-3 px-2 py-1 bg-green-200 text-green-800 rounded-md">
                            {gradePercentage}%
                          </div>
                        </div>
                        
                        {assignment.feedback && (
                          <>
                            <h4 className="font-medium text-green-800 mt-4 mb-2">Feedback</h4>
                            <div className="bg-white p-3 rounded-md border border-green-200">
                              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: assignment.feedback }}></div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <Link 
                        href={`/student/assignments/${assignmentID}/edit`}
                        className={`inline-block px-4 py-2 bg-[#0071BC] text-white rounded-md hover:bg-[#005a99] ${
                          assignment.grade !== null ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        aria-disabled={assignment.grade !== null}
                      >
                        {assignment.grade !== null ? 'Graded - Cannot Edit' : 'Edit Submission'}
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No submission yet</h3>
                    <p className="text-gray-600 mb-4">Submit your assignment before the due date.</p>
                    <Link 
                      href={`/student/assignments/${assignmentID}/submit`}
                      className="inline-block px-4 py-2 bg-[#0071BC] text-white rounded-md hover:bg-[#005a99]"
                    >
                      Submit Assignment
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">
            {/* Assignment Info Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#2E3192] p-4 text-white">
                <h2 className="text-xl font-semibold">Information</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {assignment.assignmentDetails.course && (
                    <div>
                      <p className="text-sm text-gray-500">Course</p>
                      <p className="font-medium">{assignment.assignmentDetails.course.code}: {assignment.assignmentDetails.course.name}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">{formatDate(assignment.assignmentDetails.dueDate)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Maximum Marks</p>
                    <p className="font-medium">{assignment.assignmentDetails.maxMarks}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{assignment.status.replace('_', ' ')}</p>
                  </div>
                  
                  {assignment.daysRemaining !== null && (
                    <div className={`p-3 rounded-md ${assignment.isPastDue ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'}`}>
                      {assignment.isPastDue ? (
                        <p className="font-medium">Overdue by {Math.abs(assignment.daysRemaining)} days</p>
                      ) : (
                        <p className="font-medium">{assignment.daysRemaining} days remaining</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-[#2E3192] p-4 text-white">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {!assignment.submittedAt && (
                    <Link 
                      href={`/student/assignments/${assignmentID}/submit`}
                      className="block w-full text-center px-4 py-2 bg-[#0071BC] text-white rounded-md hover:bg-[#005a99]"
                    >
                      Submit Assignment
                    </Link>
                  )}
                  
                  {assignment.submittedAt && assignment.grade === null && (
                    <Link 
                      href={`/student/assignments/${assignmentID}/edit`}
                      className="block w-full text-center px-4 py-2 bg-[#0071BC] text-white rounded-md hover:bg-[#005a99]"
                    >
                      Edit Submission
                    </Link>
                  )}
                  
                  <Link 
                    href="/student/assignments"
                    className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                  >
                    View All Assignments
                  </Link>
                  
                  {assignment.assignmentDetails.course && (
                    <Link 
                      href={`/student/courses/${assignment.assignmentDetails.course.id}`}
                      className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                    >
                      Go to Course
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching assignment details:", error);
    return (
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">Error</h2>
          <p className="text-gray-600 mt-2">Failed to load assignment details. Please try again later.</p>
          <Link href="/student/assignments" className="inline-block mt-4 bg-[#2E3192] text-white px-4 py-2 rounded-md">
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }
}