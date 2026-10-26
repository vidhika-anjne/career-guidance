import React from "react";
import { Link } from "react-router-dom";
import PathConstants from "../../routes/PathConstants";

const Arts = () => {

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <header className="sticky top-0 py-6 text-center text-white bg-black z-2 bg-opacity-70">
        <h1 className="text-3xl">Explore Career Paths in Arts</h1>
        <nav>
          <ul className="flex justify-center gap-4 py-4 list-none">
            <li>
              <Link
                to={PathConstants.HOME}
                className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={PathConstants.SCIENCE}
                className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
              >
                Science
              </Link>
            </li>
            <li>
              <Link
                to={PathConstants.COMMERCE}
                className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
              >
                Commerce
              </Link>
            </li>
            <li>
              <Link
                to={PathConstants.TECHNOLOGY}
                className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
              >
                Technology
              </Link>
            </li>
            <li>
              <Link
                to={PathConstants.ARTS}
                className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
              >
                Arts
              </Link>
            </li>
            <li>
              <Link
                to={PathConstants.DESIGN}
                className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
              >
                Design
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Introduction Section */}
      <section className="max-w-4xl p-8 mx-auto my-6 text-center bg-white rounded-lg bg-opacity-80">
        <h2 className="mb-4 text-2xl font-bold text-red-400">
          Why Choose Arts?
        </h2>
        <p className="text-gray-600">
          The Arts offer diverse career options in fields like Fine Arts,
          Literature, Performing Arts, and more. Ideal for students with
          creativity, cultural awareness, and a passion for expression.
        </p>
      </section>

      {/* Career Options Section */}
      <section className="py-8">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Popular Career Options
        </h2>
        <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Fine Arts",
              description:
                "Express creativity through painting, sculpture, and visual arts.",
              link: PathConstants.FINEARTS,
            },
            {
              title: "Literature",
              description:
                "Explore writing, editing, and publishing as a career in literature.",
              link: PathConstants.LITERATURE,
            },
            {
              title: "Performing Arts",
              description:
                "Engage audiences through acting, dancing, and musical performances.",
              link: PathConstants.PERFORMINGARTS,
            },
            {
              title: "History & Culture",
              description:
                "Preserve and interpret cultural heritage as a historian or curator.",
              link: PathConstants.HISTORYANDCULTURE,
            },
            {
              title: "Journalism",
              description:
                "Report on important issues and tell stories as a journalist or editor.",
              link: PathConstants.JOURNALISM,
            },
          ].map((career, index) => (
            <div
              key={index}
              className="p-4 text-center bg-white rounded-lg shadow bg-opacity-90"
            >
              <h3 className="mb-2 text-xl font-bold text-red-400">
                <Link to={career.link} className="hover:underline">
                  {career.title}
                </Link>
              </h3>
              <p className="text-gray-600">{career.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Relevant Courses Section */}
      <section className="py-8">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Relevant Courses
        </h2>
        <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Bachelor of Fine Arts (BFA)",
              description:
                "Develop skills in painting, sculpture, and graphic arts.",
            },
            {
              title: "BA in Literature",
              description:
                "Study literature, writing, and critical analysis techniques.",
            },
            {
              title: "Performing Arts Degree",
              description:
                "Train in acting, music, and dance for a career in the arts.",
            },
            {
              title: "History and Culture Studies",
              description:
                "Learn about art history, archaeology, and cultural preservation.",
            },
            {
              title: "Mass Communication",
              description:
                "Pursue journalism, media studies, and broadcasting.",
            },
          ].map((course, index) => (
            <div
              key={index}
              className="p-4 text-center bg-white rounded-lg shadow bg-opacity-90"
            >
              <h3 className="mb-2 text-xl font-bold text-red-400">
                {course.title}
              </h3>
              <p className="text-gray-600">{course.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-8 text-center text-white bg-black bg-opacity-80">
        <h2 className="mb-4 text-2xl font-bold text-red-400">
          Ready to Start Your Journey?
        </h2>
        <Link
          to={`${PathConstants.SEARCH}?path=arts`}
          className="px-6 py-2 text-white transition bg-red-400 rounded hover:bg-red-500 cursor-pointer"
        >
          Find Arts Colleges
        </Link>
      </section>
    </div>
  );
};

export default Arts;
