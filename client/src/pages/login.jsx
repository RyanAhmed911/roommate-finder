import React, { useState } from 'react';
import { Home, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";



export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'bachelor'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    if (isLogin) {
      navigate("/home");  
    } else {
      navigate("/home");  
    }
  };


  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'bachelor'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8ebe6] via-[#d9d5cc] to-[#e3d5c8] p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#7a9178] rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#c4a276] rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#8a9488] rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="text-6xl font-bold text-[#6b8268]">
                <span className="relative inline-block">
                  h
                  <Home className="absolute top-4 left-1/2 transform -translate-x-1/2 w-5 h-5 text-[#5a7057]" />
                </span>
                <span className="text-[#7a9178]">ome</span>
              </div>
              <div className="text-5xl font-bold text-[#b89968] -mt-3">
                harmony
              </div>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#6b8268] via-[#8a9488] to-[#b89968] rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Find Your Perfect Living Space & Roommate</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isLogin ? 'Sign in to continue your journey' : 'Join Home Harmony today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a9178] focus:border-transparent transition"
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a9178] focus:border-transparent transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7a9178] focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 relative">
                    <input
                      type="radio"
                      name="role"
                      value="bachelor"
                      checked={formData.role === 'bachelor'}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="p-3 border-2 border-gray-300 rounded-lg text-center cursor-pointer peer-checked:border-[#7a9178] peer-checked:bg-[#e8ebe6] transition">
                      <span className="text-sm font-medium">Bachelor/Tenant</span>
                    </div>
                  </label>
                  <label className="flex-1 relative">
                    <input
                      type="radio"
                      name="role"
                      value="owner"
                      checked={formData.role === 'owner'}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="p-3 border-2 border-gray-300 rounded-lg text-center cursor-pointer peer-checked:border-[#b89968] peer-checked:bg-[#e3d5c8] transition">
                      <span className="text-sm font-medium">Property Owner</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-[#7a9178] border-gray-300 rounded focus:ring-[#7a9178]" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-[#7a9178] hover:text-[#6b8268] font-medium">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7a9178] to-[#6b8268] hover:from-[#6b8268] hover:to-[#5a7057] text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleForm}
                className="text-[#7a9178] hover:text-[#6b8268] font-semibold"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to Home Harmony's Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

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