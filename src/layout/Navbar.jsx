import { Link, useLocation } from "react-router-dom";
import PathConstants from "../routes/PathConstants";
import { useNavigate } from "react-router-dom";

function NavBar({ home = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname);

  if (location.pathname === "/user") {
    return (
      <header className="px-4 py-20 text-center text-white bg-black bg-opacity-60">
        <h2 className="mb-4 text-4xl font-bold uppercase">
          Unlocking Career Pathways
        </h2>
        <p className="max-w-xl mx-auto mb-6 text-lg">
          Discover the best educational streams and start your journey towards a
          fulfilling career.
        </p>
        <button
          onClick={() =>
            document
              .getElementById("subjects")
              .scrollIntoView({ behavior: "smooth" })
          }
          className="px-6 py-2 font-bold text-white transition-all duration-300 bg-yellow-500 rounded hover:bg-yellow-600"
        >
          Explore Streams
        </button>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 py-6 text-center text-white bg-black bg-opacity-70">
      <h1 className="text-3xl">Explore Career Paths in Commerce</h1>
      <nav>
        <ul className="flex justify-center gap-4 py-4 list-none">
          <li>
            <a
              href="home.html"
              className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="science.html"
              className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
            >
              Science
            </a>
          </li>
          <li>
            <a
              href="commerce.html"
              className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
            >
              Commerce
            </a>
          </li>
          <li>
            <a
              href="technology.html"
              className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
            >
              Technology
            </a>
          </li>
          <li>
            <a
              href="arts.html"
              className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
            >
              Arts
            </a>
          </li>
          <li>
            <a
              href="design.html"
              className="px-4 py-2 text-white no-underline rounded hover:bg-red-500 hover:border-white"
            >
              Design
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default NavBar;
