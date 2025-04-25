'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import type { Monaco } from '@monaco-editor/react';

interface UnifiedCodeEditorProps {
  initialCode?: string;
  defaultLanguage?: string;
  allowLanguageChange?: boolean;
}

const DEFAULT_CODE: { [key: string]: string } = {
  javascript: '// Welcome to JS\nconsole.log("Hello World!");',
  typescript: '// Welcome to TS\nconsole.log("Hello World!");',
  python: '# Welcome to Python\nprint("Hello World!")',
  java: `// Welcome to Java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}`,
  cpp: `// Welcome to C++
#include <iostream>

int main() {
  std::cout << "Hello World!";
  return 0;
}`,
  csharp: `// Welcome to C#
using System;

public class Program {
  public static void Main() {
    Console.WriteLine("Hello World!");
  }
}`,
  ruby: '# Welcome to Ruby\nputs "Hello World!"',
  go: `// Welcome to Go
package main
import "fmt"

func main() {
  fmt.Println("Hello World!")
}`,
  rust: `// Welcome to Rust
fn main() {
  println!("Hello World!");
}`,
  swift: '// Welcome to Swift\nprint("Hello World!")',
};

const LANGUAGE_VERSIONS: { [key: string]: string } = {
  javascript: '18.15.0',
  typescript: '5.0.3',
  python: '3.10.0',
  java: '15.0.2',
  cpp: '10.2.0',
  csharp: '6.12.0',
  ruby: '3.0.1',
  go: '1.18.0',
  rust: '1.67.0',
  swift: '5.7.3',
};

const LANGUAGE_ICONS: { [key: string]: string } = {
  javascript: 'JS',
  typescript: 'TS',
  python: 'Py',
  java: 'Ja',
  cpp: 'C++',
  csharp: 'C#',
  ruby: 'Rb',
  go: 'Go',
  rust: 'Rs',
  swift: 'Sw',
};

export default function UnifiedCodeEditor({
  initialCode,
  defaultLanguage = 'javascript',
  allowLanguageChange = true,
}: UnifiedCodeEditorProps) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(
    initialCode || DEFAULT_CODE[defaultLanguage] || `// Welcome to ${defaultLanguage}`
  );
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editorLayout, setEditorLayout] = useState<'horizontal' | 'vertical'>('horizontal');

  // When the language changes, update the code if no initial code is provided
  useEffect(() => {
    if (!initialCode) {
      setCode(DEFAULT_CODE[language] || `// Welcome to ${language}`);
    }
  }, [language, initialCode]);

  // Also update if the initialCode prop changes (for example, after fetching example code)
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  // Handle screen resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setEditorLayout('vertical');
      } else {
        setEditorLayout('horizontal');
      }
    };

    // Set initial layout
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('smeclabs-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'E0E0E0', background: '132243' },
        { token: 'comment', foreground: '6AC4B9' },
        { token: 'keyword', foreground: '38B6FF' },
        { token: 'string', foreground: '7ED8D4' },
        { token: 'number', foreground: 'FF8B85' },
      ],
      colors: {
        'editor.background': '#0D1B30',
        'editor.foreground': '#E0E0E0',
        'editor.lineHighlightBackground': '#1A2A42',
        'editorLineNumber.foreground': '#5D7B9D',
        'editorCursor.foreground': '#00A99D',
        'editor.selectionBackground': '#2E3192CC',
        'editor.selectionHighlightBackground': '#2E319233',
        'editor.inactiveSelectionBackground': '#00A99D33',
        'editorSuggestWidget.background': '#132243',
        'editorSuggestWidget.border': '#2E3192',
        'editorSuggestWidget.highlightForeground': '#00A99D',
      },
    });
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput('$ Running your code...');

    try {
      const { data } = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language,
        version: LANGUAGE_VERSIONS[language],
        files: [{ content: code }],
      });

      setOutput(
        [data.run.stdout, data.run.stderr]
          .filter(Boolean)
          .join('\n')
          .trim() || '$ Program executed successfully with no output'
      );
    } catch (error) {
      setOutput(error instanceof Error ? `$ Error: ${error.message}` : '$ Execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-gray-50 dark:bg-[#0A1525] text-gray-900 dark:text-gray-100 pt-14">
      {/* Main Content */}
      <div className={`flex flex-1 overflow-hidden ${editorLayout === 'vertical' ? 'flex-col' : 'flex-row'}`}>
        {/* Editor */}
        <div className={`flex-1 flex flex-col ${editorLayout === 'vertical' ? 'border-b' : 'border-r'} border-gray-200 dark:border-[#2E3192]/30 min-h-[50vh]`}>
          <div className="px-4 py-3 bg-gray-50 dark:bg-[#132243]/50 border-b border-gray-200 dark:border-[#2E3192]/30 text-sm font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-[#00A99D]">Editor</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {code.split('\n').length} lines | {code.length} chars
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center h-8 px-2 bg-gradient-to-r from-[#2E3192]/20 to-[#00A99D]/20 border border-[#00A99D]/30 rounded-md text-xs font-medium text-[#00A99D]">
                  {LANGUAGE_ICONS[language]}
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={!allowLanguageChange}
                  className="w-32 sm:w-40 px-2 py-1.5 bg-white dark:bg-[#0D1B30] rounded-md border border-gray-300 dark:border-[#2E3192]/50 text-sm focus:outline-none focus:ring-1 focus:ring-[#00A99D] transition-all"
                >
                  {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleRunCode}
                disabled={isLoading}
                className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-md font-medium text-xs ${
                  isLoading
                    ? 'bg-[#0071BC]/70 text-white cursor-wait'
                    : 'bg-[#0071BC] hover:bg-[#00A99D] text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Running</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Run</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex-1 h-full w-full overflow-hidden">
            <Editor
              height="100%"
              width="100%"
              theme="smeclabs-theme"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              beforeMount={handleEditorWillMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                padding: { top: 15 },
                lineNumbersMinChars: 3,
                glyphMargin: false,
                renderWhitespace: 'selection',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                mouseWheelZoom: true,
                fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
                fontLigatures: true,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col min-h-[50vh]">
          <div className="px-4 py-3 bg-gray-50 dark:bg-[#132243]/50 border-b border-gray-200 dark:border-[#2E3192]/30 text-sm font-medium">
            <span className="text-gray-700 dark:text-[#00A99D]">Output</span>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-white dark:bg-[#0D1B30] border-l border-gray-200 dark:border-[#2E3192]/30">
            <pre className="font-mono text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-200">
              {output || (isLoading ? '$ Running your code...' : '$ Click "Run Code" to execute your program')}
            </pre>
            {output && !isLoading && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2E3192]/30 text-xs text-gray-500 dark:text-[#00A99D]/70">
                Executed at {new Date().toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-white dark:bg-[#132243] border-t border-gray-200 dark:border-[#2E3192]/30 text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-[#2E3192] to-[#00A99D]"></span>
          <span>{language.charAt(0).toUpperCase() + language.slice(1)} {LANGUAGE_VERSIONS[language]}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setEditorLayout(editorLayout === 'horizontal' ? 'vertical' : 'horizontal')}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#0D1B30] transition-colors"
            title="Toggle layout"
          >
            {editorLayout === 'horizontal' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="12" y1="3" x2="12" y2="21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="12" x2="21" y2="12" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}