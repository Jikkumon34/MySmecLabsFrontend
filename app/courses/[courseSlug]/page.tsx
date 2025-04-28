import { createApolloClient } from "@/lib/apolloClient";
import { gql } from "@apollo/client";
import Link from "next/link";


interface PageProps {
  params: Promise<{
    courseSlug: string;
  }>;
}

// GraphQL query for course details
const GET_COURSE_BY_SLUG = gql`
  query GetCourseBySlug($slug: String!) {
    courseBySlug(slug: $slug) {
      id
      name
      code
      description
      recommendedDuration
      
      presentation {
        subtitle
        shortDescription
        isSelfPaced
        totalHours
        thumbnailUrl
        studentCount
        averageRating
        reviewCount
        
        features {
          id
          featureText
        }
        
        outcomes {
          id
          title
          description
          iconType
        }
        
        testimonials {
          id
          studentName
          studentTitle
          testimonialText
          rating
          profileImage
        }
      }
      
      topics {
        id
        title
        description
        order
        subtopics {
          id
          title
          description
          order
        }
      }
    }
  }
`;

interface CourseDetailData {
  courseBySlug: {
    id: string;
    name: string;
    code: string;
    description: string;
    recommendedDuration: string;
    presentation: {
      subtitle: string;
      shortDescription: string;
      isSelfPaced: boolean;
      totalHours: number;
      thumbnailUrl: string;
      studentCount: number;
      averageRating: number;
      reviewCount: number;
      features: Array<{ id: string; featureText: string }>;
      outcomes: Array<{ 
        id: string;
        title: string;
        description: string;
        iconType: string;
      }>;
      testimonials: Array<{
        id: string;
        studentName: string;
        studentTitle: string;
        testimonialText: string;
        rating: number;
        profileImage: string;
      }>;
    };
    topics: Array<{
      id: string;
      title: string;
      description: string;
      order: number;
      subtopics: Array<{
        id: string;
        title: string;
        description: string;
        order: number;
      }>;
    }>;
  };
}

// Helper function to render stars based on rating
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg 
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-500" : "text-slate-300"}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function CourseDetail({ params }: PageProps) {
  const { courseSlug } = await params;
  

  // Create Apollo client
  const client = createApolloClient();
  
  try {
    // Query GraphQL with JWT authentication
    const { data } = await client.query<CourseDetailData>({
      query: GET_COURSE_BY_SLUG,
      variables: {
        slug: courseSlug
      },
  
      fetchPolicy: "no-cache"
    });
    
    const course = data.courseBySlug;
    
    // Sort topics and subtopics by order
    const sortedTopics = [...course.topics].sort((a, b) => a.order - b.order).map(topic => ({
      ...topic,
      subtopics: [...topic.subtopics].sort((a, b) => a.order - b.order)
    }));

    return (
      <main className="bg-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden hero-gradient">
          <div className="absolute inset-0 dot-pattern"></div>
          
          <div className="relative m mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:flex lg:items-center lg:gap-12">
            {/* Content */}
            <div className="lg:w-1/2">
              <span className="inline-block mb-4 px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                Professional Certificate
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-4">
                <span className="gradient-text">{course.name}</span>
                {course.presentation.subtitle && <br/>}
                {course.presentation.subtitle}
              </h1>
              <p className="text-lg text-slate-700 mb-6 max-w-2xl">
                {course.presentation.shortDescription}
              </p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                </div>
                <div className="text-slate-700">
                  <p className="text-sm font-medium">Join {course.presentation.studentCount.toLocaleString()}+ students</p>
                  <div className="flex items-center gap-1 text-sm">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>

                    <span>{Number(course.presentation.averageRating).toFixed(1)} ({course.presentation.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={`/student/dashboard?enroll=${course.id}`}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Enroll Now — Free
                </Link>
                <Link 
                  href="#course-modules"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-slate-900 bg-white hover:bg-slate-50 rounded-lg transition-all shadow hover:shadow-md border border-slate-200"
                >
                  Watch Preview
                </Link>
              </div>
            </div>

            {/* Preview Card */}
            <div className="hidden lg:block lg:w-1/2 mt-10 lg:mt-0">
              <div className="relative bg-white rounded-2xl shadow-xl p-5 border border-slate-200 transform rotate-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                
                {/* Course features section */}
                <div className="space-y-3 mb-5">
                  <h3 className="text-lg font-semibold text-slate-900">What You&apos;ll Learn</h3>
                  
                  {course.presentation.features.map((feature) => (
                    <div key={feature.id} className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-slate-700">{feature.featureText}</p>
                    </div>
                  ))}
                </div>
                
                {/* Self-paced badge */}
                {course.presentation.isSelfPaced && (
                  <div className="absolute bottom-0 right-0 -mb-6 -mr-6 bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg">
                    Self-paced
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{course.presentation.totalHours} Hours</h3>
                  <p className="text-slate-600">Interactive Content</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{sortedTopics.length} Modules</h3>
                  <p className="text-slate-600">Hands-on Projects</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Certificate</h3>
                  <p className="text-slate-600">Upon Completion</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Course Modules Section */}
        <section id="course-modules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Course Modules</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-3xl mx-auto">
              Comprehensive curriculum to master {course.name.toLowerCase()}
            </p>
          </div>

          <div className="space-y-4">
            {sortedTopics.map((topic, index) => (
              <details key={topic.id} className="group border border-slate-100 rounded-xl bg-white">
                <summary className="flex items-center justify-between p-4 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 ${index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                      <span className={`text-lg font-bold ${index % 2 === 0 ? 'text-blue-700' : 'text-green-700'}`}>{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{topic.title}</h3>
                  </div>
                  <svg className="w-5 h-5 text-slate-500 transform transition-transform duration-200 group-open:rotate-180"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-slate-600 space-y-2">
                  <p>{topic.description}</p>
                  {topic.subtopics.length > 0 && (
                    <ul className="space-y-1">
                      {topic.subtopics.map((subtopic) => (
                        <li key={subtopic.id} className="flex items-center gap-2">
                          <svg className={`w-4 h-4 ${index % 2 === 0 ? 'text-blue-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M5 13l4 4L19 7" />
                          </svg>
                          {subtopic.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Certificate Details Section */}
        <section id="certificate-details" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Certificate Details</h2>
          <p className="text-slate-600 mb-8">
            Upon successful completion, you&apos;ll receive:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Verifiable Certificate */}
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Verifiable Certificate</h3>
                <p className="text-slate-600 text-sm">
                  Downloadable PDF you can validate online.
                </p>
              </div>
            </div>

            {/* Digital Badge */}
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M5 13l4 4L19 7"/>
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Digital Badge</h3>
                <p className="text-slate-600 text-sm">
                  Earn a badge for social media and resumes.
                </p>
              </div>
            </div>

            {/* Industry Accreditation */}
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M9 12h6m-6 4h6M12 20a8 8 0 100-16 8 8 0 000 16z"/>
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Industry Accreditation</h3>
                <p className="text-slate-600 text-sm">
                  Recognized by top data organizations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes Section */}
        <section className="bg-blue-700 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.presentation.outcomes.map((outcome) => (
                <div key={outcome.id} className="bg-white/10 backdrop-blur p-5 rounded-xl border border-blue-600">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {outcome.iconType === "bolt" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      )}
                      {outcome.iconType === "code" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      )}
                      {outcome.iconType === "chart" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      )}
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{outcome.title}</h3>
                  <p className="text-blue-100">
                    {outcome.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">What Our Students Say</h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              Hear from learners who&apos;ve transformed their careers with DataSkill.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {course.presentation.testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-100 bg-slate-200"></div>
                  <div className="ml-3">
                    <p className="text-slate-900 font-semibold">{testimonial.studentName}</p>
                    <p className="text-sm text-slate-500">{testimonial.studentTitle}</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-3">
                  &quot;{testimonial.testimonialText}&quot;
                </p>
                <RatingStars rating={testimonial.rating} />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error fetching course details:", error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading course details. Please try again later.</p>
        </div>
      </div>
    );
  }
}

// Add this to your globals.css or in a style tag in layout.tsx
export const metadata = {
  title: 'Course Details',
  description: 'View detailed information about this course',
};