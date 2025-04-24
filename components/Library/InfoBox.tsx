'use client';

import React from 'react';

interface InfoBoxProps {
  color: string;
  content: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ color, content }) => {
  return (
    <div  className='note-box bg-white border-l-4 border-blue-500 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-6 max-w-2xl mx-auto'>
      <div className="flex items-start p-4 md:p-5">
        <div className="flex-shrink-0 mr-3 md:mr-4">
          <svg
            className={`w-5 h-5 text-${color}-500 mt-1`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Information</h3>
          <p className="text-gray-700 leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
