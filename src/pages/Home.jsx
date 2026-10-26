import React from "react";
import { Link } from "react-router-dom";
import PathConstants from "../routes/PathConstants";

const Home = () => {
  const heroBg = require("../assets/Images/hero/1.jpg");

  return (
    <>
      <div className="relative min-h-screen ">
        {/* Hero Section */}
        <section
          className="px-4 py-20 text-center text-white bg-center bg-cover bg-no-repeat bg-fixed hero-animate-bg"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${heroBg})`,
          }}
        >
          <h2 className="mb-4 text-4xl font-bold uppercase font-display animate-fade-up select-none cursor-default">
            Unlocking Career Pathways
          </h2>
          <p className="max-w-xl mx-auto mb-6 text-lg animate-fade-up delay-200 select-none cursor-default">
            Discover the best educational streams and start your journey towards
            a fulfilling career.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("subjects")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="px-6 py-2 font-bold text-white transition-all duration-300 bg-yellow-500 rounded hover:bg-yellow-600 animate-fade-up delay-400"
          >
            Explore Streams
          </button>
        </section>

        {/* Subjects Section */}
        <section id="subjects" className="px-4 py-16 bg-white bg-opacity-90">
          <h2 className="mb-8 text-3xl font-bold text-center font-display select-none cursor-default">
            Discover Your Perfect Career Path
          </h2>

          {/* New Features Section */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                to={PathConstants.APTITUDE}
                className="group p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 hover:brightness-105 bg-gradient-to-br from-blue-50/70 via-white/50 to-blue-100/40 backdrop-blur-xl ring-1 ring-blue-200/50 hover:ring-blue-300/70 cursor-pointer"
              >
                <div className="text-center">
                  <div className="mx-auto mb-3 w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 text-2xl">🧠</div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-display">Aptitude Test</h3>
                  <p className="text-sm text-slate-600">Discover your ideal career stream through our comprehensive assessment</p>
                </div>
              </Link>

              <Link
                to={PathConstants.CAREERPATHS}
                className="group p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 hover:brightness-105 bg-gradient-to-br from-emerald-50/70 via-white/50 to-emerald-100/40 backdrop-blur-xl ring-1 ring-emerald-200/50 hover:ring-emerald-300/70 cursor-pointer"
              >
                <div className="text-center">
                  <div className="mx-auto mb-3 w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 text-2xl">🛤️</div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-display">Career Roadmaps</h3>
                  <p className="text-sm text-slate-600">Explore detailed career journeys from 12th grade to success</p>
                </div>
              </Link>

              <Link
                to={PathConstants.TIMELINE}
                className="group p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 hover:brightness-105 bg-gradient-to-br from-violet-50/70 via-white/50 to-violet-100/40 backdrop-blur-xl ring-1 ring-violet-200/50 hover:ring-violet-300/70 cursor-pointer"
              >
                <div className="text-center">
                  <div className="mx-auto mb-3 w-12 h-12 rounded-full flex items-center justify-center bg-violet-100 text-violet-600 text-2xl">📅</div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-display">Timeline Tracker</h3>
                  <p className="text-sm text-slate-600">Never miss important deadlines and exam dates</p>
                </div>
              </Link>
            </div>
          </div>

          <h2 className="mb-8 text-2xl font-bold text-center text-gray-700 font-display select-none cursor-default">
            Or Browse by Subject Stream
          </h2>
          <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto sm:grid-cols-2 lg:grid-cols-3">
            {/* Science Card */}
            <div className="p-6 text-center transition-all duration-300 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 bg-gradient-to-br from-sky-50/80 via-white/60 to-sky-100/60 backdrop-blur ring-1 ring-sky-200/60 hover:ring-sky-300/80 select-none cursor-default">
              <h3 className="mb-4 text-2xl font-bold text-gray-800 font-display">Science</h3>
              <p className="mb-6 text-gray-600">
                Explore careers in Medicine, Physics, Chemistry, and Biological
                Sciences. Perfect for analytical minds who love exploring the
                natural world.
              </p>
              <Link
                to={PathConstants.SCIENCE}
                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 cursor-pointer"
              >
                Learn More
              </Link>
            </div>
            {/* Commerce Card */}
            <div className="p-6 text-center transition-all duration-300 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 bg-gradient-to-br from-orange-50/80 via-white/60 to-orange-100/60 backdrop-blur ring-1 ring-orange-200/60 hover:ring-orange-300/80 select-none cursor-default">
              <h3 className="mb-4 text-2xl font-bold text-gray-800 font-display">
                Commerce
              </h3>
              <p className="mb-6 text-gray-600">
                Dive into careers in Business, Finance, Accounting, and
                Economics. Ideal for students interested in the corporate world
                and financial markets.
              </p>
              <Link
                to={PathConstants.COMMERCE}
                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 cursor-pointer"
              >
                Learn More
              </Link>
            </div>
            {/* Technology Card */}
            <div className="p-6 text-center transition-all duration-300 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 bg-gradient-to-br from-indigo-50/80 via-white/60 to-indigo-100/60 backdrop-blur ring-1 ring-indigo-200/60 hover:ring-indigo-300/80 select-none cursor-default">
              <h3 className="mb-4 text-2xl font-bold text-gray-800 font-display">
                Technology
              </h3>
              <p className="mb-6 text-gray-600">
                Pursue careers in IT, Software Development, Artificial
                Intelligence, and Cybersecurity. Great for problem-solvers and
                tech enthusiasts.
              </p>
              <Link
                to={PathConstants.TECHNOLOGY}
                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 cursor-pointer"
              >
                Learn More
              </Link>
            </div>
            {/* Arts Card */}
            <div className="p-6 text-center transition-all duration-300 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 bg-gradient-to-br from-pink-50/80 via-white/60 to-pink-100/60 backdrop-blur ring-1 ring-pink-200/60 hover:ring-pink-300/80 select-none cursor-default">
              <h3 className="mb-4 text-2xl font-bold text-gray-800 font-display">Arts</h3>
              <p className="mb-6 text-gray-600">
                Explore careers in Literature, History, Music, and Performing
                Arts. Perfect for creative minds and those passionate about
                culture and expression.
              </p>
              <Link
                to={PathConstants.ARTS}
                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 cursor-pointer"
              >
                Learn More
              </Link>
            </div>
            {/* Design Card */}
            <div className="p-6 text-center transition-all duration-300 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 bg-gradient-to-br from-cyan-50/80 via-white/60 to-cyan-100/60 backdrop-blur ring-1 ring-cyan-200/60 hover:ring-cyan-300/80 select-none cursor-default">
              <h3 className="mb-4 text-2xl font-bold text-gray-800 font-display">Design</h3>
              <p className="mb-6 text-gray-600">
                Dive into Graphic Design, Interior Design, Fashion, and Product
                Design. Ideal for students who love creativity, aesthetics, and
                innovation.
              </p>
              <Link
                to={PathConstants.DESIGN}
                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 cursor-pointer"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
