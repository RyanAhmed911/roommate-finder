import React from 'react';
import { Home, Search, Users, DollarSign, MessageSquare, Calendar, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Find Rooms",
      description: "Search and discover your perfect bachelor accommodation with advanced filters",
      color: "from-[#7a9178] to-[#6b8268]"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Match Roommates",
      description: "Find compatible roommates based on lifestyle, habits, and preferences",
      color: "from-[#8a9488] to-[#7a9178]"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Manage Expenses",
      description: "Track shared expenses, split bills, and manage finances with roommates",
      color: "from-[#b89968] to-[#a88858]"
    }
  ];

  const additionalFeatures = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Real-time Chat",
      description: "Connect instantly with potential roommates and property owners"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Chore Scheduler",
      description: "Organize household tasks with automated rotation system"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Compatibility Score",
      description: "AI-powered matching based on your lifestyle preferences"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8ebe6] via-[#d9d5cc] to-[#e3d5c8]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#7a9178] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-[#c4a276] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-[#8a9488] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-bold">
              <span className="text-[#6b8268] relative inline-block">
                h
                <Home className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 text-[#5a7057]" />
              </span>
              <span className="text-[#7a9178]">ome</span>
              <span className="text-[#b89968] ml-1">harmony</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-6 py-2 text-[#6b8268] font-medium hover:text-[#5a7057] transition">
              Sign In
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-[#7a9178] to-[#6b8268] text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="text-[#6b8268]">Find Your Perfect</span>
            <br />
            <span className="text-[#b89968]">Living Space</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Connect with compatible roommates, discover ideal accommodations, and manage your shared living experience all in one place
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button className="px-8 py-4 bg-gradient-to-r from-[#7a9178] to-[#6b8268] text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-200">
              Start Your Journey
            </button>
            <button className="px-8 py-4 bg-white text-[#6b8268] font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Main Features Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              <button className="mt-6 text-[#7a9178] font-semibold flex items-center hover:text-[#6b8268] transition">
                Explore Feature
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-center text-[#6b8268] mb-8">
            Everything You Need for Harmonious Living
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-r from-[#e8ebe6] to-[#d9d5cc] rounded-full flex items-center justify-center text-[#6b8268] mb-4 shadow-md">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-xl p-6">
            <div className="text-4xl font-bold text-[#7a9178] mb-2">5000+</div>
            <div className="text-gray-700 font-medium">Active Users</div>
          </div>
          <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-xl p-6">
            <div className="text-4xl font-bold text-[#8a9488] mb-2">1200+</div>
            <div className="text-gray-700 font-medium">Listed Rooms</div>
          </div>
          <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-xl p-6">
            <div className="text-4xl font-bold text-[#b89968] mb-2">98%</div>
            <div className="text-gray-700 font-medium">Match Success</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[#7a9178] to-[#6b8268] rounded-2xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-white text-lg mb-8 opacity-90">
            Join thousands of bachelors who have found their ideal living situation
          </p>
          <button className="px-10 py-4 bg-white text-[#6b8268] font-bold rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-200">
            Create Free Account
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-300 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p>&copy; 2024 Home Harmony. Making bachelor living easier and more harmonious.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

