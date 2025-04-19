// app/student/syllabus/CourseAccordion.tsx
'use client'

import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, FileText } from 'lucide-react';

// Define TypeScript interfaces
interface Topic {
  id: string;
  title: string;
  description?: string;
  parentTopic?: Topic;
  subtopics?: Topic[];
  order: number;
}

interface Course {
  id: string;
  name: string;
  code: string;
  courseType: string;
  description?: string;
  parentCourse?: Course;
  subcourses?: Course[];
  topics?: Topic[];
  order: number;
  recommendedDuration?: number;
}

interface CourseAccordionProps {
  course: Course;
}

// Helper function to get course type badge style
// const getCourseTypeStyle = (courseType: string) => {
//   switch(courseType) {
//     case 'MAIN':
//       return 'bg-blue-100 text-blue-800';
//     case 'MODULE':
//       return 'bg-purple-100 text-purple-800';
//     case 'UNIT':
//       return 'bg-green-100 text-green-800';
//     default:
//       return 'bg-gray-100 text-gray-800';
//   }
// };

// Main Course Accordion Component
export default function CourseAccordion({ course }: CourseAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Main Course Header */}
      <div 
        className="flex items-center justify-between bg-[#2E3192] p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center text-white">
          {isOpen ? 
            <ChevronDown className="h-5 w-5 mr-2" /> : 
            <ChevronRight className="h-5 w-5 mr-2" />
          }
          <div>
            <span className="inline-block px-2 py-1 rounded-full text-xs bg-white text-[#2E3192] mr-2">{course.code}</span>
            <h2 className="text-lg font-semibold inline">{course.name}</h2>
          </div>
        </div>
        
        {course.recommendedDuration && (
          <div className="flex items-center text-white">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{course.recommendedDuration} hours</span>
          </div>
        )}
      </div>
      
      {/* Main Course Content */}
      {isOpen && (
        <div className="p-4">
          {/* Course Description */}
          {course.description && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-gray-700">{course.description}</p>
            </div>
          )}
          
          {/* Modules */}
          {course.subcourses && course.subcourses.length > 0 && (
            <div className="space-y-4">
              {course.subcourses
                .sort((a, b) => a.order - b.order)
                .map((module) => (
                  <ModuleAccordion key={module.id} module={module} />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Module Accordion Component
function ModuleAccordion({ module }: { module: Course }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border rounded-md overflow-hidden">
      {/* Module Header */}
      <div 
        className="flex items-center justify-between bg-[#00A99D] p-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center text-white">
          {isOpen ? 
            <ChevronDown className="h-4 w-4 mr-2" /> : 
            <ChevronRight className="h-4 w-4 mr-2" />
          }
          <div>
            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-white text-[#00A99D] mr-2">{module.code}</span>
            <h3 className="text-md font-medium inline">{module.name}</h3>
          </div>
        </div>
        
        {module.recommendedDuration && (
          <div className="flex items-center text-white">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{module.recommendedDuration} hours</span>
          </div>
        )}
      </div>
      
      {/* Module Content */}
      {isOpen && (
        <div className="p-3 bg-white">
          {/* Module Description */}
          {module.description && (
            <div className="mb-3 p-2 bg-gray-50 rounded-md">
              <p className="text-gray-700 text-sm">{module.description}</p>
            </div>
          )}
          
          {/* Units */}
          {module.subcourses && module.subcourses.length > 0 && (
            <div className="space-y-3 pl-2">
              {module.subcourses
                .sort((a, b) => a.order - b.order)
                .map((unit) => (
                  <UnitAccordion key={unit.id} unit={unit} />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Unit Accordion Component
function UnitAccordion({ unit }: { unit: Course }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border rounded-md overflow-hidden">
      {/* Unit Header */}
      <div 
        className="flex items-center justify-between bg-[#0071BC] p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center text-white">
          {isOpen ? 
            <ChevronDown className="h-4 w-4 mr-1" /> : 
            <ChevronRight className="h-4 w-4 mr-1" />
          }
          <div>
            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-white text-[#0071BC] mr-2">{unit.code}</span>
            <h4 className="text-sm font-medium inline">{unit.name}</h4>
          </div>
        </div>
        
        {unit.recommendedDuration && (
          <div className="flex items-center text-white">
            <Clock className="h-3 w-3 mr-1" />
            <span className="text-xs">{unit.recommendedDuration} hours</span>
          </div>
        )}
      </div>
      
      {/* Unit Content */}
      {isOpen && (
        <div className="p-2 bg-white">
          {/* Unit Description */}
          {unit.description && (
            <div className="mb-2 p-2 bg-gray-50 rounded-md">
              <p className="text-gray-700 text-sm">{unit.description}</p>
            </div>
          )}
          
          {/* Topics */}
          {unit.topics && unit.topics.length > 0 ? (
            <div className="space-y-2">
              {unit.topics
                .filter(topic => !topic.parentTopic) // Only show parent topics
                .sort((a, b) => a.order - b.order)
                .map((topic) => (
                  <TopicItem 
                    key={topic.id} 
                    topic={topic} 
                    subtopics={unit.topics?.filter(t => 
                      t.parentTopic && t.parentTopic.id === topic.id
                    )}
                  />
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic px-2">No topics available</p>
          )}
        </div>
      )}
    </div>
  );
}

// Topic Component
function TopicItem({ topic, subtopics }: { topic: Topic, subtopics?: Topic[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubtopics = subtopics && subtopics.length > 0;
  
  return (
    <div className="ml-2">
      <div 
        className={`flex items-start ${hasSubtopics ? 'cursor-pointer' : ''}`}
        onClick={() => hasSubtopics && setIsOpen(!isOpen)}
      >
        <div className="mt-1">
          {hasSubtopics ? (
            isOpen ? <ChevronDown className="h-3 w-3 text-gray-500" /> : <ChevronRight className="h-3 w-3 text-gray-500" />
          ) : (
            <FileText className="h-3 w-3 text-gray-500" />
          )}
        </div>
        <div className="ml-2">
          <p className="text-sm font-medium text-gray-700">{topic.title}</p>
          {topic.description && (
            <p className="text-xs text-gray-500 mt-1">{topic.description}</p>
          )}
        </div>
      </div>
      
      {/* Subtopics */}
      {isOpen && hasSubtopics && (
        <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-2">
          {subtopics
            .sort((a, b) => a.order - b.order)
            .map((subtopic) => (
              <div key={subtopic.id} className="flex items-start">
                <FileText className="h-3 w-3 text-gray-400 mt-1" />
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-700">{subtopic.title}</p>
                  {subtopic.description && (
                    <p className="text-xs text-gray-500">{subtopic.description}</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}