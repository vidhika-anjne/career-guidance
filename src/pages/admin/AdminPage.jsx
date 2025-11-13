import React from "react";
import { Link } from "react-router-dom";
import PathConstants from "../../routes/PathConstants";

const AdminDashboard = () => {

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="shadow-md bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container flex items-center justify-between px-4 py-6 mx-auto">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>
      </header>

      {/* Content */}
      <div className="container px-4 py-10 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Manage Users */}
          <Link
            to={PathConstants.MANAGEUSERS}
            className="block p-8 transition transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500 rounded-full">
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  version="1.1"
                  viewBox="0 0 80.13 80.13"
                >
                  <g>
                    <path d="M48.355,17.922c3.705,2.323,6.303,6.254,6.776,10.817c1.511,0.706,3.188,1.112,4.966,1.112 c6.491,0,11.752-5.261,11.752-11.751c0-6.491-5.261-11.752-11.752-11.752C53.668,6.35,48.453,11.517,48.355,17.922z M40.656,41.984 c6.491,0,11.752-5.262,11.752-11.752s-5.262-11.751-11.752-11.751c-6.49,0-11.754,5.262-11.754,11.752S34.166,41.984,40.656,41.984 z M45.641,42.785h-9.972c-8.297,0-15.047,6.751-15.047,15.048v12.195l0.031,0.191l0.84,0.263 c7.918,2.474,14.797,3.299,20.459,3.299c11.059,0,17.469-3.153,17.864-3.354l0.785-0.397h0.084V57.833 C60.688,49.536,53.938,42.785,45.641,42.785z M65.084,30.653h-9.895c-0.107,3.959-1.797,7.524-4.47,10.088 c7.375,2.193,12.771,9.032,12.771,17.11v3.758c9.77-0.358,15.4-3.127,15.771-3.313l0.785-0.398h0.084V45.699 C80.13,37.403,73.38,30.653,65.084,30.653z M20.035,29.853c2.299,0,4.438-0.671,6.25-1.814c0.576-3.757,2.59-7.04,5.467-9.276 c0.012-0.22,0.033-0.438,0.033-0.66c0-6.491-5.262-11.752-11.75-11.752c-6.492,0-11.752,5.261-11.752,11.752 C8.283,24.591,13.543,29.853,20.035,29.853z M30.589,40.741c-2.66-2.551-4.344-6.097-4.467-10.032 c-0.367-0.027-0.73-0.056-1.104-0.056h-9.971C6.75,30.653,0,37.403,0,45.699v12.197l0.031,0.188l0.84,0.265 c6.352,1.983,12.021,2.897,16.945,3.185v-3.683C17.818,49.773,23.212,42.936,30.589,40.741z"></path>
                  </g>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-700">Manage Users</h2>
            </div>
            <p className="text-gray-600">
              View, update, and manage all user accounts.
            </p>
          </Link>

          {/* Manage Colleges */}
          <Link
            to={PathConstants.MANAGECOLLEGES}
            className="block p-8 transition transform bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500 rounded-full">
                <svg
                  className="w-10 h-10"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  role="img"
                  aria-label="Manage Colleges"
                >
                  <path d="M981.333 469.333a21.333 21.333 0 0 0-21.333 21.334v85.333a85.333 85.333 0 0 1-85.333 85.333H149.333a85.333 85.333 0 0 1-85.333-85.333V149.333A85.333 85.333 0 0 1 149.333 64h725.334A85.333 85.333 0 0 1 960 149.333a21.333 21.333 0 1 0 42.667 0A128 128 0 0 0 874.667 21.333H149.333A128 128 0 0 0 21.333 149.333v426.667a128 128 0 0 0 128 128h725.334a128 128 0 0 0 128-128v-85.333a21.333 21.333 0 0 0-21.334-21.334zM896 960H128a21.333 21.333 0 0 0 0 42.667h768a21.333 21.333 0 0 0 0-42.667zM832 170.667h-66.133A85.333 85.333 0 0 0 682.667 106.667a85.333 85.333 0 0 0-83.2 64H192a21.333 21.333 0 1 0 0 42.667h407.467A85.333 85.333 0 0 0 682.667 234.667a85.333 85.333 0 0 0 83.2-64H832a21.333 21.333 0 1 0 0-42.667zM682.667 853.333a21.333 21.333 0 1 0 0-42.666H341.333a21.333 21.333 0 1 0 0 42.666h341.334zM832 341.333H424.533a85.333 85.333 0 0 0-83.2-64 85.333 85.333 0 0 0-83.2 64H192a21.333 21.333 0 1 0 0 42.667h66.133A85.333 85.333 0 0 0 341.333 426.667a85.333 85.333 0 0 0 83.2-64H832a21.333 21.333 0 1 0 0-42.667zM832 512h-66.133a85.333 85.333 0 0 0-83.2-64 85.333 85.333 0 0 0-83.2 64H192a21.333 21.333 0 1 0 0 42.667h407.467a85.333 85.333 0 0 0 83.2 64 85.333 85.333 0 0 0 83.2-64H832a21.333 21.333 0 1 0 0-42.667z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-700">
                Manage Colleges
              </h2>
            </div>
            <p className="text-gray-600">
              Add, delete, and manage college data.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
