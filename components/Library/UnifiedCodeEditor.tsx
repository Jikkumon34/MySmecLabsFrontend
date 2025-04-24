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

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('modern-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'E0E0E0', background: '1A1A1A' },
        { token: 'comment', foreground: '6A9955' },
      ],
      colors: {
        'editor.background': '#1A1A1A',
        'editor.lineHighlightBackground': '#2A2A2A',
        'editorLineNumber.foreground': '#858585',
        'editorCursor.foreground': '#A7A7A7',
        'editor.selectionBackground': '#264F78',
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
    <div className="flex flex-col h-screen bg-neutral-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.5 12.641v5.484a3.5 3.5 0 11-5 0v-6.989L5.03 8.158a5 5 0 015.94-5.94 5 5 0 015.94 5.94l-4.47 4.47z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold">CodeCanvas</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
              {LANGUAGE_ICONS[language]}
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={!allowLanguageChange}
              className="w-full md:w-48 px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
            >
              {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)} {LANGUAGE_VERSIONS[lang]}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRunCode}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm ${
              isLoading
                ? 'bg-purple-400 dark:bg-purple-600 text-white cursor-wait'
                : 'bg-purple-600 hover:bg-purple-700 text-white transition-colors'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Run Code</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden bg-white dark:bg-gray-800">
        {/* Editor */}
        <div className="flex-1 flex flex-col border-b md:border-r border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 text-sm font-medium">
            Editor
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              theme="modern-dark"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              beforeMount={handleEditorWillMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                padding: { top: 20 },
                lineNumbersMinChars: 3,
                glyphMargin: false,
                renderWhitespace: 'selection',
              }}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 text-sm font-medium">
            Output
          </div>
          <div className="flex-1 overflow-auto p-4 bg-white dark:bg-gray-800">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {output || (isLoading ? '$ Running your code...' : 'Click "Run Code" to execute your program')}
            </pre>
            {output && !isLoading && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                Executed at {new Date().toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 flex flex-col md:flex-row justify-between">
        <div className="mb-1 md:mb-0">
          {language.charAt(0).toUpperCase() + language.slice(1)} {LANGUAGE_VERSIONS[language]}
        </div>
        <div className="flex gap-4">
          <span>{code.split('\n').length} lines</span>
          <span>{code.length} chars</span>
        </div>
      </div>
    </div>
  );
}
