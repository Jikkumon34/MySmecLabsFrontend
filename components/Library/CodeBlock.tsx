'use client';

import { useState, useEffect } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import Prism from 'prismjs';

// You can still include a few common languages if you like, but here we'll load dynamically
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-markup';
// import 'prismjs/components/prism-python';

// Define props interface
interface CodeBlockProps {
  initialCode?: string;
  language?: string;
  slug?: string; // Newly added slug prop
  title?: string;
  description?: string;
  tryItUrl?: string;
}

const CodeBlock = ({
  initialCode = '',
  language,
  title = 'test',
  description = 'test description',
  tryItUrl = 'test url',
}: CodeBlockProps) => {
  const [code, setCode] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('text');

  useEffect(() => {
    setCode(initialCode);

    async function loadLanguage(lang: string) {
      try {
        // Dynamically import the language definition
        await import(`prismjs/components/prism-${lang}.js`);
        setDetectedLanguage(lang);
      } catch (error) {
        console.error(`Could not load Prism language: ${lang}`, error);
        // Fallback to python or text if the language is not available
        setDetectedLanguage('python');
      }
    }

    if (language) {
      loadLanguage(language);
    } else {
      setDetectedLanguage('python');
    }
  }, [initialCode, language]);

  return (
    <div className="my-5 rounded-md bg-gray-50 p-4">
      {title && (
        <h2 className="font-bold text-gray-800 text-xl mb-2.5">{title}</h2>
      )}
      {description && (
        <div
          className="text-gray-600 mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      <Highlight
        prism={Prism}
        code={code}
        language={detectedLanguage}
        theme={themes.github}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`rounded-md p-5 text-sm leading-normal border border-gray-300 font-mono overflow-auto ${className}`}
            style={{ ...style, backgroundColor: 'white' }}
          >
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
      {tryItUrl && (
        <a href={tryItUrl} target="_blank" rel="noopener noreferrer">
          <button
            style={{ backgroundColor: 'var(--color-btn)' }}
            className="hover:bg-green-600 text-white py-2 px-4 border-0 rounded cursor-pointer mt-4 text-sm transition-colors"
          >
            Try it Yourself »
          </button>
        </a>
      )}
    </div>
  );
};

export default CodeBlock;
