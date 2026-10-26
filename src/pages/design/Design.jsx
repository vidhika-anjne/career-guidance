import React from "react";
import { Link } from "react-router-dom";
import PathConstants from "../../routes/PathConstants";

const Design = () => {
  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover "
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1423865927/photo/interior-perspective-sketch-design-of-modern-living-room-drawings-and-plans-for-house.jpg?s=2048x2048&w=is&k=20&c=kxq-dEyyqvKY2lMFWXTbyUE0hgYdAwFH1Xwk1D_Ptd0=')",
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

      {/* Introduction Section */}
      <section className="max-w-3xl p-10 mx-auto mt-5 text-center bg-white rounded-lg bg-opacity-80">
        <h2 className="mb-4 text-2xl font-bold text-red-400">
          Why Choose Design?
        </h2>
        <p className="text-gray-700">
          Design careers offer creative outlets in fields such as Graphic
          Design, Fashion, Interior Design, and more. Perfect for students with
          an eye for aesthetics and problem-solving through creativity.
        </p>
      </section>

      {/* Career Options Section */}
      <section className="p-10">
        <h2 className="mb-6 text-2xl text-center text-gray-900">
          Popular Career Options
        </h2>
        <div className="grid max-w-5xl grid-cols-1 gap-6 mx-auto sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Graphic Design",
              link: PathConstants.GRAPHICDESIGN,
              description:
                "Create visual content for branding, advertising, and more.",
            },
            {
              title: "Fashion Design",
              link: PathConstants.FASHION,
              description:
                "Design clothing and accessories as a fashion designer.",
            },
            {
              title: "Interior Design",
              link: PathConstants.INTERIORDESIGN,
              description:
                "Enhance interior spaces through innovative designs.",
            },
            {
              title: "Industrial Design",
              link: PathConstants.INDUSTRYDESIGN,
              description:
                "Design products and systems for functionality and aesthetics.",
            },
            {
              title: "UX/UI Design",
              link: PathConstants.UIUX,
              description:
                "Design user experiences and interfaces for digital products.",
            },
          ].map(({ title, link, description }) => (
            <div
              key={title}
              className="p-5 text-center bg-white rounded-lg shadow-lg bg-opacity-90"
            >
              <h3 className="mb-3 text-lg font-semibold text-red-400">
                <Link to={link} className="hover:underline">
                  {title}
                </Link>
              </h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Relevant Courses Section */}
      <section className="p-10">
        <h2 className="mb-6 text-2xl text-center text-gray-900">
          Relevant Courses
        </h2>
        <div className="grid max-w-5xl grid-cols-1 gap-6 mx-auto sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Bachelor of Design (B.Des)",
              description:
                "Specialize in Graphic Design, Fashion, or Interior Design.",
            },
            {
              title: "Diploma in UX/UI Design",
              description:
                "Gain skills in user experience and interface design.",
            },
            {
              title: "Interior Design Certificate",
              description: "Learn fundamentals of spatial planning and decor.",
            },
            {
              title: "Fashion Design Diploma",
              description:
                "Develop skills in fashion illustration, fabric, and garment construction.",
            },
            {
              title: "MBA in Design Management",
              description:
                "Combine design expertise with business skills for leadership roles.",
            },
          ].map(({ title, description }) => (
            <div
              key={title}
              className="p-5 text-center bg-white rounded-lg shadow-lg bg-opacity-90"
            >
              <h3 className="mb-3 text-lg font-semibold text-red-400">
                {title}
              </h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="p-10 mt-10 text-center text-white bg-black bg-opacity-80">
        <h2 className="mb-4 text-2xl text-red-400">
          Ready to Start Your Journey?
        </h2>
        <Link
          to={`${PathConstants.SEARCH}?path=design`}
          className="px-6 py-2 text-white transition bg-red-400 rounded hover:bg-red-500 cursor-pointer"
        >
          Find Design Colleges
        </Link>
      </section>
    </div>
  );
};

export default Design;
