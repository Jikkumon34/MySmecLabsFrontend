'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Topic, TopicHeadersType } from '@/types/types';

interface SidebarProps {
  courseSlug: string;
  topicHeaders: TopicHeadersType[];
}

interface TopicsListProps {
  topics: Topic[];
  courseSlug: string;
  isNested?: boolean;
  onLinkClick?: () => void;
  openTopicId: string | null;
  onToggle: (id: string) => void;
}

const TopicsList: React.FC<TopicsListProps> = ({
  topics,
  courseSlug,
  isNested = false,
  onLinkClick,
  openTopicId,
  onToggle,
}) => {
  return (
    <ul className={isNested ? 'ml-6' : ''}>
      {topics.map((topic) => {
        const hasChildren = topic.children && topic.children.length > 0;
        return (
          <li key={topic.id}>
            {hasChildren ? (
              <button
                onClick={() => onToggle(topic.id)}
                className="w-full text-left block px-2 py-2  hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                {topic.title}
              </button>
            ) : (
              <Link
                href={`/library/${courseSlug}/${topic.slug}`}
                onClick={() => {
                  onToggle(''); // Close all topics when leaf node is clicked
                  onLinkClick?.();
                }}
                className="block px-2 py-2  hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                {topic.title}
              </Link>
            )}
            {hasChildren && openTopicId === topic.id && (
              <TopicsList
                topics={topic.children}
                courseSlug={courseSlug}
                isNested={true}
                onLinkClick={onLinkClick}
                openTopicId={openTopicId}
                onToggle={onToggle}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ courseSlug, topicHeaders }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openTopicId, setOpenTopicId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenTopicId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-10 left-0 z-50 m-2 p-2 text-white rounded"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-opacity-40 z-20 lg:hidden"
        />
      )}

      <aside
        className={`
          sidebar w-64 fixed top-[5.5rem] bottom-0 shadow-lg overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2 px-2">Topics</h2>
          {topicHeaders.map((topicHeader) => (
            <div key={topicHeader.id} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">
                {topicHeader.title}
              </h3>
              <TopicsList
                topics={topicHeader.topics}
                courseSlug={courseSlug}
                onLinkClick={closeSidebar}
                openTopicId={openTopicId}
                onToggle={handleToggle}
              />
            </div>
          ))}


        </div>
      </aside>
    </>
  );
};

export default Sidebar;