import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Editor from '@monaco-editor/react';

export default function ProblemDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("// Write your code here");
  const [editorLanguage, setEditorLanguage] = useState('cpp'); // Default language

  const tagsSectionRef = useRef(null);
  const hintsSectionRef = useRef(null);

  useEffect(() => {
    axiosInstance.get(`questions/${id}/`)
      .then(res => {
        setQuestion(res.data);
        if (res.data.initial_code && res.data.initial_code.cpp) {
          setCode(res.data.initial_code.cpp);
        } else {
          setCode("// Your code goes here");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching problem:', err);
        setLoading(false);
      });
  }, [id]);

  const scrollToTags = () => {
    if (tagsSectionRef.current) {
      tagsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToHints = () => {
    if (hintsSectionRef.current) {
      hintsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>Loading problem...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
        <p>Problem not found.</p>
      </div>
    );
  }

  const getDifficultyColorClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-600 text-white';
      case 'Medium': return 'bg-yellow-600 text-white';
      case 'Hard': return 'bg-red-600 text-white';
      case 'Difficult': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      {/* Main content area: Problem Details (Left) + Code Editor (Right) */}
      {/* This flex-1 ensures this section takes up all vertical space between the top (if any) and bottom bar. */}
      {/* overflow-hidden on this row container is important to prevent content from spilling out */}
      <div className="flex flex-1 overflow-hidden p-2">

        {/* Left Pane: Problem Details (Takes 50% width, scrolls vertically) */}
        <div className="flex flex-col flex-1 bg-gray-800 rounded-lg mr-2 overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <div className="pb-4 border-b border-gray-700 mb-4">
              <h1 className="text-2xl font-bold text-white mb-2">
                {question.problem_code}. {question.title}
              </h1>
              <div className="flex items-center flex-wrap gap-2 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColorClass(question.difficulty)}`}>
                  {question.difficulty.toUpperCase()}
                </span>
                {question.tags && question.tags.length > 0 && (
                  <button
                    onClick={scrollToTags}
                    className="px-3 py-1 rounded-full text-gray-400 border border-gray-600 hover:bg-gray-700 transition-colors duration-200"
                  >
                    Topics
                  </button>
                )}
                {question.hints && (
                  <button
                    onClick={scrollToHints}
                    className="px-3 py-1 rounded-full text-gray-400 border border-gray-600 hover:bg-gray-700 transition-colors duration-200"
                  >
                    Hint
                  </button>
                )}
              </div>
            </div>

            <div className="tab-content text-gray-300">
              <section className="mb-6">
                <h2 className="font-semibold text-xl text-white mb-3">Description</h2>
                <p className="whitespace-pre-line text-gray-300">{question.description}</p>
              </section>

              {question.examples && question.examples.length > 0 && (
                <section className="mb-6">
                  <h2 className="font-semibold text-xl text-white mb-3">Examples</h2>
                  {question.examples.map((example, idx) => (
                    <div key={idx} className="bg-gray-700 p-4 rounded-lg mb-4 text-sm">
                      {example.input && (
                        <div className="mb-2">
                          <p className="font-medium text-gray-200">Input:</p>
                          <pre className="bg-gray-600 p-2 rounded-md overflow-x-auto">{example.input}</pre>
                        </div>
                      )}
                      {example.output && (
                        <div className="mb-2">
                          <p className="font-medium text-gray-200">Output:</p>
                          <pre className="bg-gray-600 p-2 rounded-md overflow-x-auto">{example.output}</pre>
                        </div>
                      )}
                      {example.explanation && (
                        <div>
                          <p className="font-medium text-gray-200">Explanation:</p>
                          <p className="whitespace-pre-wrap">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}

              <section className="mb-6">
                <h2 className="font-semibold text-xl text-white mb-3">Constraints</h2>
                <pre className="bg-gray-700 p-4 rounded-lg text-sm whitespace-pre-wrap overflow-x-auto">{question.constraints}</pre>
              </section>

              {question.hints && (
                <section ref={hintsSectionRef} className="mb-6">
                  <h2 className="font-semibold text-xl text-white mb-3">Hints</h2>
                  <pre className="bg-gray-700 p-4 rounded-lg text-sm whitespace-pre-wrap overflow-x-auto">{question.hints}</pre>
                </section>
              )}

              <section ref={tagsSectionRef} className="mt-6 pb-4">
                <h2 className="font-semibold text-xl text-white mb-3">Tags</h2>
                <div className="text-sm flex flex-wrap gap-2">
                  {question.tags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Editor and other possible future elements */}
        {/* This div is also flex-1, taking 50% width. It's a flex-col to stack its children vertically. */}
        <div className="flex flex-col flex-1 bg-gray-800 rounded-lg ml-2 overflow-hidden">
          {/* Editor Header: Has a fixed height determined by its padding/content */}
          <div className="flex items-center justify-between p-3 bg-gray-700 border-b border-gray-600">
            <h2 className="text-white text-lg font-semibold">Code</h2>
            <div className="flex items-center space-x-2">
              <select
                className="bg-gray-600 text-white text-sm p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editorLanguage}
                onChange={(e) => setEditorLanguage(e.target.value)}
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
          </div>

          {/* Monaco Editor Container: Explicit Fixed Height */}
          {/* This is the key change: Setting a specific pixel height for the editor's window. */}
          <div className="h-[400px] flex-shrink-0">
          {/* The flex-shrink-0 is added to ensure this div doesn't try to shrink if space is tight. */}
          {/* Monaco Editor itself will handle internal scrolling if code exceeds this 400px height. */}
            <Editor
              height="100%" // The Editor will fill 100% of its 400px parent.
              language={editorLanguage}
              value={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* This is where you could add a Console Output / Test Results section BELOW the editor */}
          {/* Example:
          <div className="flex-1 bg-gray-700 p-3 mt-2 rounded-md overflow-y-auto">
            <h3 className="text-white text-md mb-2">Console Output:</h3>
            <pre className="text-gray-300 text-sm">
              Your program output will appear here...
            </pre>
          </div>
          */}

        </div>
      </div>

      {/* Bottom Bar: Submit Button */}
      {/* This div has a fixed height, causing the main content above it to take remaining space */}
      <div className="bg-gray-800 p-4 flex justify-end items-center border-t border-gray-700 shadow-lg">
        <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200">
          Submit
        </button>
      </div>
    </div>
  );
}