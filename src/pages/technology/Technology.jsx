import React from "react";
import { Link } from "react-router-dom";
import PathConstants from "../../routes/PathConstants";

const Technology = () => {

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://www.shutterstock.com/shutterstock/photos/2164419735/display_1500/stock-vector-set-of-business-objects-open-pages-landing-page-template-folder-mail-statistics-d-web-vector-2164419735.jpg')",
      }}
    >
      <header className="sticky top-0 py-6 text-center text-white bg-black z-2 bg-opacity-70">
        <h1 className="text-3xl">Explore Career Paths in Technology</h1>
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
          Why Choose Technology?
        </h2>
        <p>
          Technology offers exciting career opportunities in Software
          Development, Artificial Intelligence, Cybersecurity, and more. Perfect
          for students interested in innovation and problem-solving.
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
              title: "Software Development",
              link: PathConstants.SOFTWAREDEV,
              description:
                "Design and build applications as a software engineer or app developer.",
            },
            {
              title: "Cyber Security",
              link: PathConstants.CYBERSECURITY,
              description:
                "Protect digital information and systems as a cybersecurity analyst.",
            },
            {
              title: "Data Science",
              link: PathConstants.DATASCIENCE,
              description:
                "Analyze big data and gain insights as a data scientist.",
            },
            {
              title: "Artificial Intelligence",
              link: PathConstants.AI,
              description:
                "Develop intelligent systems and machine learning algorithms.",
            },
            {
              title: "Cloud Computing",
              link: PathConstants.CLOUD,
              description:
                "Manage cloud services and infrastructure for scalable applications.",
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
              title: "Bachelor of Technology (B.Tech)",
              description:
                "Specialize in Software Engineering, AI, or Cybersecurity.",
            },
            {
              title: "M.Sc. in Data Science",
              description:
                "Learn advanced data analysis and machine learning techniques.",
            },
            {
              title: "Cloud Computing Certification",
              description:
                "Become a certified cloud professional in AWS or Azure.",
            },
            {
              title: "Cybersecurity Diploma",
              description:
                "Gain skills in ethical hacking and information security.",
            },
            {
              title: "MBA in IT Management",
              description:
                "Combine business skills with IT expertise for leadership roles.",
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
          to={`${PathConstants.SEARCH}?path=technology`}
          className="px-6 py-2 text-white transition bg-red-400 rounded hover:bg-red-500"
        >
          Find Technology Colleges
        </Link>
      </section>
    </div>
  );
};

export default Technology;
