import Sidebar from '@/components/Library/Sidebar';
import { fetchGraphQL } from '@/lib/graphql';
import { Course,TopicHeadersType } from '@/types/types';
import RightSidebar from '@/components/Library/RightSidebar';


import { ReactNode } from 'react';

interface CourseLayoutProps {
  children: ReactNode;
  params: Promise<{ courseSlug: string }>; // Type updated to reflect Promise
}




export default async function CourseLayout({ children, params }: CourseLayoutProps) {
  const { courseSlug } = await params; 

  // Await params before destructuring
  const query = `
  query($slug: String!) {
    libraryCourse(slug: $slug) {
      id
      title
      topicHeaders {
        id
        title
        topics {
          id
          title
          slug
          children{
            id
            title
            slug
          }
          
        }
      }
    }
  }
`;
  const variables = { slug: courseSlug };
  const data: { libraryCourse: Course & { topicHeaders: TopicHeadersType[] } } = await fetchGraphQL(query, variables);
  const course = data.libraryCourse;
  if(course.topicHeaders.length==0){
    return <h1 className='text-center  '>No topics found for this course we add conent soon of :{course.title}</h1>  // Display a message if no topics found for the course
  }


  return (
    <div className="flex flex-col md:flex-row">
  {/* Left Sidebar */}
  <div className="order-2 md:order-1">
    <Sidebar courseSlug={courseSlug} topicHeaders={course.topicHeaders} />
  </div>
  
  {/* Main Content */}
  <div className="order-1 md:order-2 ml-0 md:ml-64 pt-[5.5rem] px-4 pb-8 flex-1">
    {children}
  </div>
  
  {/* Right Sidebar */}
  <div className="order-3 md:order-3">
    <RightSidebar />
  </div>
</div>


  );
}