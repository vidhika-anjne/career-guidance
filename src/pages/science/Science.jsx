import React from "react";
import { Link } from "react-router-dom";
import PathConstants from "../../routes/PathConstants";

const Science = () => {
  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover "
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2023/10/27/22/15/technology-8346311_1280.png')",
      }}
    >
      <header className="sticky top-0 py-6 text-center text-white bg-black z-2 bg-opacity-70">
        <h1 className="text-3xl">Explore Career Paths in Commerce</h1>
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

      {/* Intro Section */}
      <section className="max-w-4xl p-10 mx-auto mt-6 text-center bg-white rounded-lg bg-opacity-80">
        <h2 className="mb-4 text-2xl font-bold text-red-500">
          Why Choose Science?
        </h2>
        <p>
          The field of Science offers diverse career opportunities in Medicine,
          Physics, Chemistry, and Biological Sciences. It is ideal for students
          who are curious, analytical, and interested in exploring the natural
          world.
        </p>
      </section>

      {/* Career Options Section */}
      <section className="py-10">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Popular Career Options
        </h2>
        <div className="grid max-w-6xl grid-cols-1 gap-6 px-4 mx-auto sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              title: "Medicine",
              link: PathConstants.MEDICINE,
              description:
                "Become a doctor, nurse, or medical researcher. This field is focused on healthcare and medical advancements.",
            },
            {
              title: "Engineering",
              link: PathConstants.ENGINEERING,
              description:
                "Pursue careers in Mechanical, Electrical, or Civil Engineering. Engineers solve problems and innovate across industries.",
            },
            {
              title: "Biotechnology",
              link: PathConstants.BIOTECHNOLOGY,
              description:
                "Explore careers in genetics, pharmaceuticals, and bioinformatics. This field merges biology and technology.",
            },
            {
              title: "Environmental Science",
              link: PathConstants.EVS,
              description:
                "Work in conservation, climate research, and sustainability projects. Focus on protecting our planet’s ecosystems.",
            },
            {
              title: "Research Scientists",
              link: PathConstants.RESEARCH,
              description:
                "Conduct experiments in Physics, Chemistry, or Biology. Research scientists push the boundaries of knowledge.",
            },
          ].map((career, index) => (
            <div
              key={index}
              className="p-6 transition-shadow bg-white rounded-lg shadow-lg hover:shadow-xl"
            >
              <h3 className="mb-4 text-xl font-semibold text-red-500">
                <Link to={career.link} className="no-underline">
                  {career.title}
                </Link>
              </h3>
              <p>{career.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Relevant Courses Section */}
      <section className="py-10">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Relevant Courses
        </h2>
        <div className="grid max-w-6xl grid-cols-1 gap-6 px-4 mx-auto sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              title: "B.Sc. in Physics, Chemistry, or Biology",
              description:
                "Pursue a Bachelor of Science degree with specializations in core science subjects.",
            },
            {
              title: "MBBS",
              description:
                "Become a medical professional with a Bachelor of Medicine, Bachelor of Surgery degree.",
            },
            {
              title: "B.E. in Biotechnology",
              description:
                "Study Biotechnology engineering, focusing on genetics, pharmaceuticals, and bioinformatics.",
            },
            {
              title: "Bachelor of Environmental Science",
              description:
                "Learn about environmental conservation, sustainability, and climate research.",
            },
            {
              title: "M.Sc. in Specialized Fields",
              description:
                "Advance your knowledge with a Master of Science degree in a specialized area of your choice.",
            },
          ].map((course, index) => (
            <div
              key={index}
              className="p-6 transition-shadow bg-white rounded-lg shadow-lg hover:shadow-xl"
            >
              <h3 className="mb-4 text-xl font-semibold text-red-500">
                {course.title}
              </h3>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-10 text-center text-white bg-black bg-opacity-80">
        <h2 className="mb-6 text-2xl font-bold text-red-500">
          Ready to Start Your Journey?
        </h2>
        <Link
          to={`${PathConstants.SEARCH}?path=science`}
          className="px-6 py-2 text-white transition bg-red-400 rounded hover:bg-red-500"
        >
          Find Science Colleges
        </Link>
      </section>
    </div>
  );
};

export default Science;
