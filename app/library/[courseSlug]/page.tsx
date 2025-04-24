import { fetchGraphQL } from '@/lib/graphql';
import { Course } from '@/types/types';
import { sanitizeHtml } from '@/utils/sanitize';
interface CoursePageProps {
  params: Promise<{ courseSlug: string }>;
}

export async function generateMetadata({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const query = `
    query($slug: String!) {
      libraryCourse(slug: $slug) {
        title
      }
    }
  `;
  const variables = { slug: courseSlug };
  const data: { libraryCourse: Course } = await fetchGraphQL(query, variables);
  const course = data.libraryCourse;
  return {
    title: course.title ? `${course.title} | LudoCode` : 'Course | LudoCode',
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const query = `
    query($slug: String!) {
      libraryCourse(slug: $slug) {
        title
        description
      }
    }
  `;
  const variables = { slug: courseSlug };
  const data: { libraryCourse: Course } = await fetchGraphQL(query, variables);
  const course = data.libraryCourse;

  return (
    <div>
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <div
        className="content-description" // Add this class
        style={{ whiteSpace: 'pre-wrap' }}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(course.description) }}
      />

    </div>
  );
}
