import React from "react";
import { Link } from "react-router-dom";
import PathConstants from "../../routes/PathConstants";

const Commerce = () => {
  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/background/20210710/original/pngtree-e-commerce-company-technology-design-picture-image_1015563.jpg')",
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
          Why Choose Commerce?
        </h2>
        <p>
          Commerce provides a wide range of career options in Accounting,
          Finance, Marketing, and Business Management, perfect for students
          interested in the corporate world.
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
              title: "Accounting",
              link: PathConstants.ACCOUNTING,
              description:
                "Manage financial records and audits as a Chartered Accountant or Financial Analyst.",
            },
            {
              title: "Finance",
              link: PathConstants.FINANCE,
              description:
                "Work in investment banking, wealth management, or financial planning.",
            },
            {
              title: "Marketing",
              link: PathConstants.MARKETING,
              description:
                "Develop strategies for brand management, advertising, and digital marketing.",
            },
            {
              title: "Business Management",
              link: PathConstants.BUSINESS,
              description:
                "Become a business consultant, operations manager, or entrepreneur.",
            },
            {
              title: "Economics",
              link: PathConstants.ECONOMICS,
              description:
                "Analyze market trends as an economist or policy analyst.",
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
              title: "Bachelor of Commerce (B.Com)",
              description:
                "Learn the fundamentals of Accounting, Finance, and Business Law.",
            },
            {
              title: "MBA",
              description:
                "Pursue a Master of Business Administration in various specializations.",
            },
            {
              title: "Chartered Accountancy (CA)",
              description:
                "Become a certified expert in financial reporting and auditing.",
            },
            {
              title: "B.A. in Economics",
              description:
                "Focus on economic theory, policy-making, and market analysis.",
            },
            {
              title: "Company Secretary (CS)",
              description: "Oversee corporate governance and compliance.",
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
          to={`${PathConstants.SEARCH}?path=commerce`}
          className="px-6 py-2 text-white transition bg-red-400 rounded hover:bg-red-500 cursor-pointer"
        >
          Find Commerce Colleges
        </Link>
      </section>
    </div>
  );
};

export default Commerce;
