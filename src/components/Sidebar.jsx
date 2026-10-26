import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PathConstants from "../routes/PathConstants";
import { motion } from "motion/react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="absolute top-0 left-0 z-0">
      {/* Sidebar Toggle Button */}
      <motion.div
        className="fixed p-3 text-black bg-white rounded-full cursor-pointer z-5 top-5 left-5"
        onClick={toggleSidebar}
        whileHover={{
          scale: 1.2,
        }}
        transition={{
          duration: 100,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <rect x="5" y="6" width="20" height="2" rx="1" fill="black" />
          <rect x="5" y="14" width="20" height="2" rx="1" fill="black" />
          <rect x="5" y="22" width="20" height="2" rx="1" fill="black" />
        </svg>
      </motion.div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-10 w-64 h-full bg-white text-black p-5 transition-transform duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar header */}

        <div className="flex items-center justify-center">
          <h2 className="mb-5 text-xl select-none">
            User Dashboard
          </h2>
        </div>

        <hr className="border-black" />
        {/* Sidebar Menu Items */}

        <ul className="flex flex-col gap-2 mt-5">
          <li>
            <Link
              to={PathConstants.DASHBOARD}
              className="block px-3 py-2 transition duration-200 ease-in-out rounded-none hover:bg-gray-600"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to={PathConstants.APTITUDE}
              className="block px-3 py-2 transition duration-200 ease-in-out rounded-none hover:bg-gray-600"
            >
              Aptitude Test
            </Link>
          </li>
          <li>
            <Link
              to={PathConstants.CAREERPATHS}
              className="block px-3 py-2 transition duration-200 ease-in-out rounded-none hover:bg-gray-600"
            >
              Career Paths
            </Link>
          </li>
          <li>
            <Link
              to={PathConstants.TIMELINE}
              className="block px-3 py-2 transition duration-200 ease-in-out rounded-none hover:bg-gray-600"
            >
              Timeline
            </Link>
          </li>
          <li>
            <Link
              to={PathConstants.PROFILE}
              className="block px-3 py-2 transition duration-200 ease-in-out rounded-none hover:bg-gray-600"
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[-1]"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
