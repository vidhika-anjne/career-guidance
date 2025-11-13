import React from "react";
import { Link } from "react-router-dom";
import PathConstants from "../routes/PathConstants";
import bg from "../assets/Images/pexels-photo-2080963.jpeg";

const About = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-900 shadow-md">
        <div className="container flex items-center justify-between px-6 py-4 mx-auto">
          <Link
            to={PathConstants.ABOUT}
            className="text-2xl font-bold text-white"
          >
            Career<span className="text-blue-500">Verse</span>
          </Link>
          <div className="flex space-x-6">
            <Link
              to={PathConstants.ABOUT}
              className="text-white transition hover:text-orange-500"
            >
              HOME
            </Link>
            <a
              href="#contact"
              className="text-white transition hover:text-orange-500"
            >
              CONTACTS
            </a>
            <Link
              to={PathConstants.LOGIN}
              className="text-white transition hover:text-orange-500"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="flex flex-col items-start justify-center h-screen px-10 text-white bg-center bg-cover bg-no-repeat bg-fixed hero-animate-bg"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${bg})`,
        }}
      >
        <h2 className="mb-6 text-5xl font-bold font-display animate-fade-up select-none cursor-default">
          Empowering You to Discover, Decide, and Design Your Career Journey.
        </h2>
        <div className="flex gap-4">
          <Link to={PathConstants.LOGIN}>
            <button className="px-8 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-semibold animate-fade-up delay-200">
              Get Started →
            </button>
          </Link>
          <a href="#about">
            <button className="px-6 py-3 text-white bg-orange-500 rounded-md hover:bg-orange-600 animate-fade-up delay-400">
              Learn More
            </button>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-200">
        <div className="container px-6 mx-auto">
          <h2 className="mb-8 text-4xl font-bold text-center text-gray-800">
            Who <span className="text-orange-500">We Are</span>
          </h2>
          <p className="mb-6 text-lg text-center text-gray-700">
            CareerVerse is a platform that offers insights into life, social,
            and school skills. We provide world-class advice on career choices
            based on interests, IQ, and stable future opportunities. Join us for
            a blissful experience navigating life after high school.
          </p>
          <div className="text-center">
            <Link to={PathConstants.LOGIN}>
              <button className="px-6 py-2 text-white bg-gray-900 rounded-md hover:bg-black">
                Let's Begin
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-6 mx-auto">
          <h2 className="mb-12 text-4xl font-bold text-center text-gray-800">
            What You'll Get <span className="text-blue-500">Access To</span>
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 text-center bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Aptitude Tests</h3>
              <p className="text-gray-600">Discover your strengths and interests through comprehensive assessments</p>
            </div>
            <div className="p-6 text-center bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Career Mapping</h3>
              <p className="text-gray-600">Explore different career paths and their requirements</p>
            </div>
            <div className="p-6 text-center bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏫</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">College Search</h3>
              <p className="text-gray-600">Find the best colleges and universities for your chosen field</p>
            </div>
            <div className="p-6 text-center bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Personal Dashboard</h3>
              <p className="text-gray-600">Track your progress and get personalized recommendations</p>
            </div>
            <div className="p-6 text-center bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Timeline Tracker</h3>
              <p className="text-gray-600">Plan your educational journey with milestone tracking</p>
            </div>
            <div className="p-6 text-center bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Stream Explorer</h3>
              <p className="text-gray-600">Dive deep into Science, Commerce, Arts, Technology, and Design</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link to={PathConstants.LOGIN}>
              <button className="px-8 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-semibold text-lg">
                Start Your Journey Today →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
    </div>
  );
};

export default About;
