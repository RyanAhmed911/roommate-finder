import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline text-gray-300 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-300 hover:text-white transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-300 hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline text-gray-300 hover:text-white transition">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">Follow Us</h2>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Facebook className="text-blue-500" size={20} />
                <a href="#" className="hover:underline text-gray-300 hover:text-white transition">
                  Facebook
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Twitter className="text-sky-400" size={20} />
                <a href="#" className="hover:underline text-gray-300 hover:text-white transition">
                  Twitter
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Instagram className="text-pink-500" size={20} />
                <a href="#" className="hover:underline text-gray-300 hover:text-white transition">
                  Instagram
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Linkedin className="text-blue-600" size={20} />
                <a href="#" className="hover:underline text-gray-300 hover:text-white transition">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">Connect With Us</h2>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:text-blue-500 transition">
                  <Facebook size={24} />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition">
                  <Twitter size={24} />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-500 transition">
                  <Instagram size={24} />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition">
                  <Linkedin size={24} />
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-gray-400 text-sm">
                © 2024 Roommate Finder. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm italic">
            "Home is not a place, it's a feeling. Find your perfect match and create amazing memories together!" 🏠✨
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;