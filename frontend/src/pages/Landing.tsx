export default function Landing() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-indigo-900 to-purple-800 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow">
            Welcome to <span className="text-yellow-400">AlgoRush</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Practice. Compete. Get Hired.
          </p>
          <a
            href="/login"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full text-lg transition"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <img src="/icons/practice.svg" alt="Practice" className="h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Practice</h3>
            <p className="text-gray-600">
              Solve hundreds of coding questions with detailed solutions and difficulty ratings.
            </p>
          </div>
          <div>
            <img src="/icons/compete.svg" alt="Compete" className="h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Compete</h3>
            <p className="text-gray-600">
              Participate in weekly contests and climb the leaderboard to showcase your skills.
            </p>
          </div>
          <div>
            <img src="/icons/discuss.svg" alt="Discuss" className="h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Discuss</h3>
            <p className="text-gray-600">
              Engage with a global community to learn and grow with others.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg">
            At <span className="text-indigo-600 font-medium">AlgoRush</span>, we empower developers with the tools, challenges, and community needed to excel in technical interviews and real-world programming.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-white font-bold text-lg">AlgoRush</span> © 2025
          </div>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
