// pages/[courseSlug]/[topicSlug].tsx
import CodeBlock from '@/components/Library/CodeBlock';
import InfoBox from '@/components/Library/InfoBox';
import { fetchGraphQL } from '@/lib/graphql';
import { sanitizeHtml } from '@/utils/sanitize';

// Define interfaces (unchanged from your code)
interface CodeType {
  id: string;
  typeOfCode: string;
  language: string;
  color: string;
  createdAt: string;
}

interface Note {
  id: string;
  note: string;
  color: string;
}

interface Example {
  id: string;
  title: string;
  code: string;
  output?: string;
  description?: string;
  slug: string;
  codeBoxText?: string;
  buttonText?: string;
  codeType: CodeType;
  notes: Note[];
}

interface ContentBlock {
  id: string;
  headline: string;
  subtitle: string;
  description: string;
  notes: Note[];
  examples: Example[];
}

interface Topic {
  id: string;
  title?: string;
  content: ContentBlock[];
}

interface TopicPageProps {
  params: Promise<{ courseSlug: string; topicSlug: string }>;
}

// Metadata generation (unchanged)
export async function generateMetadata({ params }: TopicPageProps) {
  const { courseSlug, topicSlug } = await params;
  const query = `
    query($courseSlug: String!, $topicSlug: String!) {
      libraryTopic(courseSlug: $courseSlug, topicSlug: $topicSlug) {
        title
      }
    }
  `;
  const variables = { courseSlug, topicSlug };
  const data = await fetchGraphQL<{ libraryTopic: Topic }>(query, variables);
  const topic = data.libraryTopic;
  return {
    title: topic.title ? `${topic.title} | SmecLabs` : 'Topic |  SmecLabs',
  };
}

// Updated TopicPage component
export default async function TopicPage({ params }: TopicPageProps) {
  const { courseSlug, topicSlug } = await params;

  const query = `
    query($courseSlug: String!, $topicSlug: String!) {
      libraryTopic(courseSlug: $courseSlug, topicSlug: $topicSlug) {
        id
        title
        content {
          id
          headline
          subtitle
          description
          notes {
            id
            note
            color
          }
          examples {
            id
            title
            code
            output
            description
            slug
            codeBoxText
            buttonText
            notes {
              id
              note
              color
            }
            codeType {
              id
              typeOfCode
              language
              color
              createdAt
            }
          }
        }
      }
    }
  `;
  const variables = { courseSlug, topicSlug };

  let topic: Topic;
  try {
    const data = await fetchGraphQL<{ libraryTopic: Topic }>(query, variables);
    topic = data.libraryTopic;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred';
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Error Loading Topic</h1>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500 font-medium">
            Oops! Something went wrong.
          </p>
          <p className="text-gray-400 mt-2">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-bold mb-8">{topic.title || 'Topic'}</h1>
      {topic.content.length > 0 ? (
        <div className="space-y-8">
          {topic.content.map((block) => (
            <div key={block.id} className="pb-8 border-b border-gray-200">
              <section>
                <h2 className="text-2xl font-semibold mb-2">
                  {block.headline}
                </h2>
                {block.subtitle && (
                  <h3 className="text-xl text-gray-600 mb-3">
                    {block.subtitle}
                  </h3>
                )}
                {/* Render sanitized HTML with preserved whitespace */}
                <div
                  className="content-description" // Add this class
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.description) }}
                />
                {block.notes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-lg font-medium mb-2">Notes:</h4>
                    {block.notes.map((note) => (
                      <InfoBox
                        key={note.id}
                        color={note.color}
                        content={note.note}
                      />
                    ))}
                  </div>
                )}
                {block.examples.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium mb-2">Examples:</h4>
                    {block.examples.map((example) => (
                      <CodeBlock
                        key={example.id}
                        tryItUrl={`/editor/${example.codeType.language}/${example.slug}`}
                        initialCode={example.code}
                        language={
                          example.codeType ? example.codeType.language : 'python'
                        }
                        slug={example.slug}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500 font-medium">
            🚧 Content is being prepared with care!
          </p>
          <p className="text-gray-400 mt-2">
            Check back soon for amazing learning materials
          </p>
        </div>
      )}
    </div>
  );
}