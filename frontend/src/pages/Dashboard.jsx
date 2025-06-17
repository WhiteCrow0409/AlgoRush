import { useEffect, useState, useMemo } from 'react'; // Import useMemo
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Component to represent the rating bars (the gray lines next to difficulty)
const RatingBars = ({ count }) => {
  return (
    <div className="flex items-center gap-0.5 ml-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-1 rounded-sm ${i < count ? 'bg-gray-500' : 'bg-gray-700'}`}
        ></div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [selectedDifficulty, setSelectedDifficulty] = useState('All'); // State for difficulty filter
  const [selectedTag, setSelectedTag] = useState('All'); // State for tag filter
  const [uniqueTags, setUniqueTags] = useState([]); // State to store unique tags for the filter dropdown
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/questions/')
      .then(res => {
        // Augment fetched data with dummy 'is_solved', 'solved_percentage', and 'rating_bars'
        const augmentedQuestions = res.data.map(q => ({
          ...q,
          is_solved: Math.random() > 0.6, // Roughly 40% unsolved, 60% solved
          solved_percentage: (Math.random() * 70 + 20).toFixed(1), // Random percentage 20-90%
          rating_bars: Math.floor(Math.random() * 5) + 1, // Random number of bars (1 to 5)
        }));

        setQuestions(augmentedQuestions);
        setLoading(false);

        const allTags = augmentedQuestions.flatMap(q => q.tags || []);
        const tags = ['All', ...new Set(allTags)].sort(); // Add 'All' option and sort
        setUniqueTags(tags);
      })
      .catch(err => {
        console.error('Error fetching questions:', err);
        setLoading(false);
      });
  }, []);

  const handleRowClick = (id) => {
    navigate(`/problem/${id}`);
  };

  // Helper function to determine difficulty pill color and text
  const getDifficultyPillClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-600 text-white';
      case 'Medium': return 'bg-yellow-600 text-white';
      case 'Hard': return 'bg-red-600 text-white';
      case 'Difficult': return 'bg-red-600 text-white'; // Fallback for 'Difficult'
      default: return 'bg-gray-500 text-white';
    }
  };

  // Memoized filtered questions based on search and filters
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            question.problem_code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDifficulty = selectedDifficulty === 'All' ||
                                question.difficulty === selectedDifficulty;

      const matchesTag = selectedTag === 'All' ||
                         (question.tags && question.tags.includes(selectedTag));

      return matchesSearch && matchesDifficulty && matchesTag;
    });
  }, [questions, searchTerm, selectedDifficulty, selectedTag]);

  return (
    <div className="px-6 py-6 bg-gray-900 min-h-screen text-gray-200"> {/* Dark background */}
      <h1 className="text-3xl font-bold text-center mb-6 text-white">Dashboard</h1>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 max-w-4xl mx-auto">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by title or ID..."
          className="px-4 py-2 rounded-md bg-gray-800 text-gray-200 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 focus:outline-none w-full md:w-auto flex-grow md:flex-grow-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Difficulty Filter */}
        <select
          className="px-4 py-2 rounded-md bg-gray-800 text-gray-200 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 focus:outline-none w-full md:w-auto"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          {/* Add 'Difficult' if it's a distinct option from your backend */}
          {/* <option value="Difficult">Difficult</option> */}
        </select>

        {/* Tags Filter */}
        <select
          className="px-4 py-2 rounded-md bg-gray-800 text-gray-200 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 focus:outline-none w-full md:w-auto"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          {uniqueTags.map(tag => (
            <option key={tag} value={tag}>{tag === 'All' ? 'All Tags' : tag}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading questions...</p>
      ) : (
        /* Table Container - Centered and Styled like Screenshot */
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700 max-w-6xl mx-auto">
          {/* The table structure starts here */}
          <table className="w-full text-sm text-left text-gray-300">
            {/* Table Header */}
            <thead className="text-xs uppercase bg-gray-800 text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 w-10"></th> {/* Empty for solved icon */}
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Title</th>
                {/* Removed Percentage Header */}
                <th scope="col" className="px-6 py-3">Difficulty</th>
                <th scope="col" className="px-6 py-3 text-center">Tags</th> {/* Center tags header */}
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {filteredQuestions.length === 0 ? (
                <tr>
                  {/* colSpan adjusted from 6 to 5 */}
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400 bg-gray-900">No questions found matching your criteria.</td>
                </tr>
              ) : (
                filteredQuestions.map((q) => (
                  <tr
                    key={q.id}
                    className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors duration-150 ease-in-out"
                    onClick={() => handleRowClick(q.id)}
                  >
                    {/* Solved Icon Cell */}
                    <td className="px-6 py-3 text-center">
                      {q.is_solved && (
                        <svg className="w-4 h-4 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-200 whitespace-nowrap">{q.problem_code}</td>
                    <td className="px-6 py-3 text-blue-400 hover:text-blue-300">{q.title}</td>
                    {/* Removed Percentage Data Cell */}
                    <td className="px-6 py-3 flex items-center justify-start"> {/* Use flex to align difficulty and bars */}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getDifficultyPillClass(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                      <RatingBars count={q.rating_bars} /> {/* Render rating bars */}
                    </td>
                    {/* Tags column: Centered content and comma-separated */}
                    <td className="px-6 py-3 text-center"> {/* Added text-center for the cell */}
                      {q.tags && q.tags.length > 0 ? (
                        <span className="text-gray-300">
                          {q.tags.join(', ')} {/* Join tags with comma and space */}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* The table structure ends here */}
        </div>
      )}
    </div>
  );
}
