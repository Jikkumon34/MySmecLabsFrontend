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

interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  subcategories: ResourceCategory[];
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

interface StudentResourcesData {
  studentResources: {
    resources: Resource[];
    categories: ResourceCategory[];
    totalCount: number;
  };
}

// GraphQL query for student resources
const GET_STUDENT_RESOURCES = gql`
  query GetStudentResources(
    $courseId: ID,
    $batchId: ID,
    $categoryId: ID,
    $resourceType: ResourceTypeEnum,
    $search: String,
    $isFeatured: Boolean,
    $limit: Int,
    $offset: Int
  ) {
    studentResources(
      courseId: $courseId,
      batchId: $batchId,
      categoryId: $categoryId,
      resourceType: $resourceType,
      search: $search,
      isFeatured: $isFeatured,
      limit: $limit,
      offset: $offset
    ) {
      resources {
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
      categories {
        id
        name
        description
        subcategories {
          id
          name
          description
        }
      }
      totalCount
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

function truncateText(text: string, maxLength: number = 150): string {
  return text.length <= maxLength
    ? text
    : text.substring(0, maxLength) + "...";
}

const ITEMS_PER_PAGE = 10;

/**
 * Student Resources Page
 */
export default async function StudentResources({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // 1. Await the lazy searchParams
  const params = await searchParams;

  // 2. Pull out and normalize each filter
  const rawCourseId = params.courseId;
  const rawBatchId = params.batchId;
  const rawCategoryId = params.categoryId;
  const rawResourceType = params.resourceType;
  const rawSearch = params.search;
  const rawFeatured = params.featured;
  const rawPage = params.page;

  const courseId = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId;
  const batchId = Array.isArray(rawBatchId) ? rawBatchId[0] : rawBatchId;
  const categoryId = Array.isArray(rawCategoryId) ? rawCategoryId[0] : rawCategoryId;
  const resourceType = Array.isArray(rawResourceType) ? rawResourceType[0] : rawResourceType;
  const search = Array.isArray(rawSearch) ? rawSearch[0] : rawSearch;
  const isFeatured = rawFeatured === "true";
  const page = parseInt(Array.isArray(rawPage) ? rawPage[0] : rawPage || "1", 10);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // 3. Authentication
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  // 4. Fetch data
  const client = createApolloClient();
  try {
    const { data } = await client.query<StudentResourcesData>({
      query: GET_STUDENT_RESOURCES,
      variables: {
        courseId,
        batchId,
        categoryId,
        resourceType,
        search,
        isFeatured,
        limit: ITEMS_PER_PAGE,
        offset,
      },
      context: {
        headers: { Authorization: `JWT ${token}` },
      },
      fetchPolicy: "no-cache",
    });


    const { resources, categories, totalCount } = data.studentResources;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // 5. Render
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold text-[#2E3192] mb-6">Learning Resources</h1>

        {/* Featured Resources */}
        {(isFeatured || !params.featured) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#0071BC] mb-4">
              {isFeatured ? "Featured Resources" : "Resources"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.filter(r => isFeatured ? r.isFeatured : true).slice(0, 3).map((resource) => (
                <Link
                  key={resource.id}
                  href={`/student/resources/${resource.id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${getResourceTypeIcon(resource.resourceType).color}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={getResourceTypeIcon(resource.resourceType).icon}
                        />
                      </svg>
                      <span className="ml-2 text-xs font-medium text-gray-500">{resource.resourceType}</span>
                      {resource.isFeatured && (
                        <span className="ml-auto px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[#2E3192] mb-1">{resource.title}</h3>
                    <div className="text-sm text-gray-500 mb-2">
                      {resource.course.code} • {resource.category?.name || "Uncategorized"}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{truncateText(resource.description)}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Updated: {formatDate(resource.updatedAt)}</span>
                      {resource.hasFiles && (
                        <span className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                          </svg>
                          {resource.fileCount} file{resource.fileCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {isFeatured && resources.length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg shadow-lg">
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <p className="text-gray-500 mt-2">No featured resources available.</p>
                <Link href="/student/resources" className="text-[#2E3192] hover:underline mt-2 inline-block">
                  View all resources
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Resource Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#0071BC] mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/student/resources?categoryId=${category.id}`}
                className={`p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow ${
                  categoryId === category.id ? "bg-[#2E3192] text-white" : "bg-white"
                }`}
              >
                <div className="font-semibold">{category.name}</div>
                <div className="text-xs mt-1">
                  {category.subcategories.length > 0
                    ? `${category.subcategories.length} subcategories`
                    : "No subcategories"}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Filter Resources</h2>
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
                placeholder="Search resources..."
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#2E3192] focus:border-[#2E3192]"
              />
            </div>
            <div>
              <label htmlFor="resourceType" className="block text-sm font-medium text-gray-600 mb-1">
                Resource Type
              </label>
              <select
                id="resourceType"
                name="resourceType"
                defaultValue={resourceType}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#2E3192] focus:border-[#2E3192]"
              >
                <option value="">All Types</option>
                <option value="NOTE">Notes</option>
                <option value="CODE">Code</option>
                <option value="FILE">Files</option>
                <option value="VIDEO">Videos</option>
                <option value="LINK">Links</option>
                <option value="QUIZ">Quizzes</option>
                <option value="EXERCISE">Exercises</option>
              </select>
            </div>
            <div className="flex items-center space-x-4 mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={isFeatured}
                  className="h-4 w-4 text-[#2E3192] focus:ring-[#2E3192] border-gray-300 rounded"
                />
                <span className="ml-2 block text-sm text-gray-600">Featured Only</span>
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

        {/* All Resources List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#0071BC] p-4 text-white">
            <h2 className="text-xl font-semibold">
              {categoryId
                ? `Resources in ${categories.find(c => c.id === categoryId)?.name || "Category"}`
                : resourceType
                ? `${resourceType} Resources`
                : "All Resources"}
            </h2>
          </div>
          <div className="p-4">
            {resources.length > 0 ? (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <Link
                    key={resource.id}
                    href={`/student/resources/${resource.id}`}
                    className="block border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row p-4">
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${getResourceTypeIcon(resource.resourceType).color}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={getResourceTypeIcon(resource.resourceType).icon}
                            />
                          </svg>
                          <h3 className="font-semibold text-[#2E3192] ml-2">{resource.title}</h3>
                          {resource.isFeatured && (
                            <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {resource.course.name} ({resource.course.code})
                          {resource.category && ` • ${resource.category.name}`}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {truncateText(resource.description)}
                        </p>
                      </div>
                      <div className="flex flex-row md:flex-col justify-between md:justify-center items-end md:items-center md:ml-6 mt-4 md:mt-0 md:min-w-24">
                        <div className="text-sm text-gray-500">
                          Updated: {formatDate(resource.updatedAt)}
                        </div>
                        {resource.hasFiles && (
                          <div className="text-sm mt-1 flex items-center text-blue-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            {resource.fileCount} attachment{resource.fileCount !== 1 ? 's' : ''}
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
                  No resources found with the selected filters.
                </p>
                <Link href="/student/resources" className="text-[#2E3192] hover:underline mt-2 inline-block">
                  View all resources
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center my-8">
                <nav className="flex items-center">
                  <Link
                    href={`/student/resources?${new URLSearchParams({
                      ...(courseId ? { courseId } : {}),
                      ...(batchId ? { batchId } : {}),
                      ...(categoryId ? { categoryId } : {}),
                      ...(resourceType ? { resourceType } : {}),
                      ...(search ? { search } : {}),
                      ...(isFeatured ? { featured: "true" } : {}),
                      page: Math.max(1, page - 1).toString()
                    })}`}
                    className={`px-3 py-1 rounded-l-md border ${
                      page === 1
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-[#2E3192] hover:bg-gray-100"
                    }`}
                    aria-disabled={page === 1}
                  >
                    Previous
                  </Link>
                  <div className="px-4 py-1 border-t border-b text-[#2E3192]">
                    Page {page} of {totalPages}
                  </div>
                  <Link
                    href={`/student/resources?${new URLSearchParams({
                      ...(courseId ? { courseId } : {}),
                      ...(batchId ? { batchId } : {}),
                      ...(categoryId ? { categoryId } : {}),
                      ...(resourceType ? { resourceType } : {}),
                      ...(search ? { search } : {}),
                      ...(isFeatured ? { featured: "true" } : {}),
                      page: Math.min(totalPages, page + 1).toString()
                    })}`}
                    className={`px-3 py-1 rounded-r-md border ${
                      page === totalPages
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-[#2E3192] hover:bg-gray-100"
                    }`}
                    aria-disabled={page === totalPages}
                  >
                    Next
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching student resources:", error);
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
          <h3 className="text-lg font-semibold text-gray-900 mt-4">Unable to load resources</h3>
          <p className="text-gray-600 mt-2">
            There was an error loading your resources. Please try again later or contact support.
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