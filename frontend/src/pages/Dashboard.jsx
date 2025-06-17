import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/questions/')
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching questions:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6"> Dashboard</h1>
      {loading ? (
        <p className="text-center">Loading questions...</p>
      ) : (
        <table className="w-full text-sm text-left border shadow-sm rounded-lg bg-white">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Difficulty</th>
              <th className="px-6 py-3">Tags</th>
              <th className="px-6 py-3">Link</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr key={q.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{index + 1}</td>
                <td className="px-6 py-3">{q.title}</td>
                <td className={`px-6 py-3 ${q.difficulty === 'Easy' ? 'text-green-600' : q.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {q.difficulty}
                </td>
                <td className="px-6 py-3">{q.tags?.join(', ')}</td>
                <td className="px-6 py-3 text-blue-500 hover:underline">
                  <a href={q.link} target="_blank" rel="noreferrer">Solve</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
