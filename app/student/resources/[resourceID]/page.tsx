import { cookies } from "next/headers";
import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import { redirect } from "next/navigation";
import Link from "next/link";


// Define TypeScript interfaces for GraphQL response data
interface ResourceFile {
  id: string;
  displayName: string;
  description: string;
  file: string;
  isPreview: boolean;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  resourceType: string;
  content: string;
  externalUrl: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  hasFiles: boolean;
  course: {
    id: string;
    name: string;
    code: string;
  };
  category?: {
    id: string;
    name: string;
  };
  files: ResourceFile[];
}

interface ResourceDetailData {
  studentResourceDetail: Resource;
}
interface PageProps {
  params:  Promise<{
    resourceID: string;
  }>;
}
// GraphQL query for student resource detail
const GET_STUDENT_RESOURCE_DETAIL = gql`
  query GetStudentResourceDetail($id: ID!) {
    studentResourceDetail(id: $id) {
      id
      title
      description
      resourceType
      content
      externalUrl
      isFeatured
      createdAt
      updatedAt
      fileCount
      hasFiles
      course {
        id
        name
        code
      }
      category {
        id
        name
      }
      files {
        id
        displayName
        description
        file
        isPreview
      }
    }
  }
`;

/** Helper functions **/

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getResourceTypeIcon(resourceType: string): { icon: string; color: string } {
  switch (resourceType) {
    case "NOTE":
      return { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "text-blue-500" };
    case "CODE":
      return { icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", color: "text-green-500" };
    case "FILE":
      return { icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z", color: "text-purple-500" };
    case "VIDEO":
      return { icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", color: "text-red-500" };
    case "LINK":
      return { icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", color: "text-cyan-500" };
    case "QUIZ":
      return { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "text-orange-500" };
    case "EXERCISE":
      return { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", color: "text-yellow-500" };
    default:
      return { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "text-gray-500" };
  }
}

// Component to render the resource content based on its type
function ResourceContent({ resource }: { resource: Resource }) {
  switch (resource.resourceType) {
    case "NOTE":
      return (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: resource.content }} />
        </div>
      );
    case "CODE":
      return (
        <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
          <pre className="whitespace-pre-wrap">{resource.content}</pre>
        </div>
      );
    case "LINK":
      return (
        <div className="mb-6">
          <p className="mb-4">{resource.description}</p>
          <a 
            href={resource.externalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#2E3192] text-white py-2 px-4 rounded-md hover:bg-blue-700 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit External Resource
          </a>
        </div>
      );
    case "VIDEO":
      if (resource.externalUrl && (resource.externalUrl.includes('youtube.com') || resource.externalUrl.includes('youtu.be'))) {
        const videoId = resource.externalUrl.includes('youtu.be') 
          ? resource.externalUrl.split('/').pop() 
          : new URL(resource.externalUrl).searchParams.get('v');
          
        return (
          <div className="mb-6">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe 
                src={`https://www.youtube.com/embed/${videoId}`} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
            <div className="prose max-w-none mt-4">
              <div dangerouslySetInnerHTML={{ __html: resource.content }} />
            </div>
          </div>
        );
      } else {
        return (
          <div className="mb-6">
            <p className="mb-4">{resource.description}</p>
            <a 
              href={resource.externalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#2E3192] text-white py-2 px-4 rounded-md hover:bg-blue-700 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Video
            </a>
          </div>
        );
      }
    default:
      return (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: resource.content }} />
        </div>
      );
  }
}

/**
 * Student Resource Detail Page
 */
export default async function ResourceDetail({ params }: PageProps) {
  const { resourceID } = await params;
  // Authentication
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  // Fetch data
  const client = createApolloClient();
  try {
    const { data } = await client.query<ResourceDetailData>({
      query: GET_STUDENT_RESOURCE_DETAIL,
      variables: { id: resourceID },
      context: {
        headers: { Authorization: `JWT ${token}` },
      },
      fetchPolicy: "no-cache",
    });

    const resource = data.studentResourceDetail;
    
    if (!resource) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">Resource not found</h3>
            <p className="text-gray-600 mt-2">
              The resource you are looking for does not exist or you don&apos;t have permission to view it.
            </p>
            <div className="mt-6">
              <Link
                href="/student/resources"
                className="inline-block bg-[#2E3192] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Back to Resources
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Get resource type icon and color
    const { icon, color } = getResourceTypeIcon(resource.resourceType);

    return (
      <div className="p-4 md:p-6">
        {/* Breadcrumb navigation */}
        <nav className="flex mb-4 text-sm">
          <Link href="/student/dashboard" className="text-gray-500 hover:text-[#2E3192]">
            Dashboard
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href="/student/resources" className="text-gray-500 hover:text-[#2E3192]">
            Resources
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900 font-medium truncate">{resource.title}</span>
        </nav>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Resource header */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="p-6">
              <div className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${color}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={icon}
                  />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-500">{resource.resourceType}</span>
                {resource.isFeatured && (
                  <span className="ml-auto px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-[#2E3192]">{resource.title}</h1>
              <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500">
                <span className="mr-4">
                  <span className="font-medium">Course:</span> {resource.course.name} ({resource.course.code})
                </span>
                {resource.category && (
                  <span className="mr-4">
                    <span className="font-medium">Category:</span> {resource.category.name}
                  </span>
                )}
                <span>
                  <span className="font-medium">Last updated:</span> {formatDate(resource.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Resource content */}
          <div className="p-6">
            {/* Description */}
            {resource.description && (
              <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h2 className="font-semibold text-lg text-blue-900 mb-2">Description</h2>
                <p className="text-blue-800">{resource.description}</p>
              </div>
            )}

            {/* Content based on resource type */}
            <div className="mb-8">
              <ResourceContent resource={resource} />
            </div>

            {/* Files section */}
            {resource.hasFiles && resource.files.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-[#0071BC] mb-4">
                  Attachments ({resource.fileCount})
                </h2>
                <div className="space-y-3">
                  {resource.files.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-[#2E3192]">{file.displayName}</h3>
                          {file.description && (
                            <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                          )}
                        </div>
                        <a
                          href={`http://127.0.0.1:8000/media/${file.file}`}
                          download
                          className="flex items-center text-[#2E3192] hover:text-blue-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between">
              <Link
                href="/student/resources"
                className="inline-flex items-center text-gray-600 hover:text-[#2E3192]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Resources
              </Link>
              {resource.category && (
                <Link
                  href={`/student/resources?categoryId=${resource.category.id}`}
                  className="inline-flex items-center text-[#2E3192] hover:underline"
                >
                  Browse more {resource.category.name} resources
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching resource details:", error);
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
          <h3 className="text-lg font-semibold text-gray-900 mt-4">Unable to load resource</h3>
          <p className="text-gray-600 mt-2">
            There was an error loading this resource. Please try again later or contact support.
          </p>
          <div className="mt-6">
            <Link
              href="/student/resources"
              className="inline-block bg-[#2E3192] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }
}