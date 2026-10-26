import React from "react";
import { Link } from "react-router-dom";
import PathConstants from "../../routes/PathConstants";

const Medicine = () => {
  return (
    <div
      className="relative z-0 font-sans text-gray-900 bg-fixed bg-center bg-cover"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2023/10/27/22/15/technology-8346311_1280.png')",
      }}
    >
      {/* Header Section */}
      <header className="sticky top-0 z-10 p-5 text-white bg-black bg-opacity-70">
        <h1 className="text-4xl font-bold text-center">
          Explore Biotechnology Courses
        </h1>
        <nav className="mt-4">
          <ul className="flex justify-center space-x-6">
            <li>
              <Link
                to={PathConstants.HOME}
                className="px-4 py-2 text-white transition border border-transparent rounded hover:bg-red-400 hover:border-white"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={PathConstants.SCIENCE}
                className="px-4 py-2 text-white transition border border-transparent rounded hover:bg-red-400 hover:border-white"
              >
                Science
              </Link>
            </li>

            <li>
              <Link
                to={PathConstants.SEARCH}
                className="px-4 py-2 text-white transition border border-transparent rounded hover:bg-red-400 hover:border-white"
              >
                College List
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Introduction Section */}
      <section className="max-w-4xl p-8 mx-auto my-8 text-center bg-white rounded-lg bg-opacity-80">
        <h2 className="mb-4 text-3xl font-bold text-red-400">
          Why Choose a Career in Medicine?
        </h2>
        <p className="text-gray-700">
          Medicine offers diverse and rewarding career opportunities. Explore
          popular courses and learn about the entrance exams required to pursue
          a career in healthcare.
        </p>
      </section>

      {/* Medicine Courses Section */}
      <section className="p-8">
        <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
          Popular Medicine Courses
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
              description:
                "The most common medical degree, providing comprehensive training in medicine and surgery.",
              exams: [
                { name: "NEET (UG)", date: "Tentative Date: May" },
                { name: "AIIMS MBBS", date: "Tentative Date: June" },
              ],
            },
            {
              title: "Doctor of Medicine (MD)",
              description:
                "A postgraduate degree focusing on specialized fields like Pediatrics and Cardiology.",
              exams: [
                { name: "NEET PG", date: "Tentative Date: March" },
                { name: "AIIMS PG", date: "Tentative Date: April" },
              ],
            },
            {
              title: "Bachelor of Dental Surgery (BDS)",
              description:
                "A professional degree for aspiring dentists, focusing on oral health and dental care.",
              exams: [{ name: "NEET (UG)", date: "Tentative Date: May" }],
            },
            {
              title: "Bachelor of Ayurvedic Medicine and Surgery (BAMS)",
              description:
                "An undergraduate program in Ayurvedic medicine, focusing on holistic healthcare.",
              exams: [{ name: "NEET (UG)", date: "Tentative Date: May" }],
            },
            {
              title: "Master of Surgery (MS)",
              description:
                "A postgraduate degree for advanced surgical training in various specialties.",
              exams: [{ name: "NEET SS", date: "Tentative Date: September" }],
            },
          ].map((course, index) => (
            <div
              key={index}
              className="p-6 text-center bg-white rounded-lg shadow-md bg-opacity-90"
            >
              <h3 className="mb-3 text-xl font-bold text-red-400">
                {course.title}
              </h3>
              <p className="mb-4 text-gray-700">{course.description}</p>
              <details>
                <summary className="font-semibold text-gray-600">
                  View Entrance Exams
                </summary>
                {course.exams.map((exam, idx) => (
                  <p key={idx} className="text-gray-600">
                    <strong>{exam.name}:</strong> {exam.date}
                  </p>
                ))}
              </details>
            </div>
          ))}
        </div>
      </section>

      {/* Career Roles & Skills */}
      <section className="p-8 bg-white/80">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">What You Can Do in Medicine</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Doctor (MBBS)", "Surgeon (MS)", "Dentist (BDS)", "Ayurvedic Practitioner (BAMS)", "Medical Researcher", "Public Health Specialist"].map((role) => (
              <div key={role} className="p-4 rounded-lg shadow bg-white">
                <p className="font-semibold text-red-400">{role}</p>
                <p className="text-sm text-gray-600 mt-1">Brief: Practice, diagnose, treat, or conduct research depending on specialization.</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">Key Skills</h3>
          <div className="flex flex-wrap gap-2">
            {["Clinical Knowledge", "Patient Care", "Ethics", "Communication", "Research Methods", "Decision Making"].map((s) => (
              <span key={s} className="px-3 py-1 text-sm rounded-full bg-red-50 text-red-600 border border-red-200">{s}</span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Entrance Exams Overview</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li><strong>NEET (UG):</strong> MBBS, BDS, BAMS entries</li>
                <li><strong>NEET PG:</strong> MD/MS specialization</li>
                <li><strong>AIIMS/INI-CET:</strong> Select Institutes of National Importance</li>
                <li><strong>NEET SS:</strong> Super-specialty (DM/MCh)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Top Colleges (Indicative)</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>AIIMS (Delhi and other campuses)</li>
                <li>CMC Vellore</li>
                <li>JIPMER Puducherry</li>
                <li>Maulana Azad Medical College (MAMC), Delhi</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="p-4 rounded-lg bg-gray-50 border">
              <h4 className="font-semibold text-gray-800 mb-1">Salary & Growth</h4>
              <p className="text-sm text-gray-700">Varies widely by specialization and institution. Example early career range: ₹6–15 LPA; experienced specialists can earn significantly higher.</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border">
              <h4 className="font-semibold text-gray-800 mb-1">Suggested Roadmap</h4>
              <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
                <li>Build Biology, Chemistry fundamentals</li>
                <li>Prepare for NEET (UG)</li>
                <li>Complete MBBS/BAMS/BDS</li>
                <li>Internship; select specialization</li>
                <li>Clear PG exams (NEET PG/INI-CET)</li>
                <li>Residency; super-specialize if needed</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-8 text-center text-white bg-black bg-opacity-80">
        <h2 className="mb-6 text-3xl font-bold text-red-400">
          Interested in a Medical Career?
        </h2>
        <Link
          to={`${PathConstants.SEARCH}?types=medical`}
          className="px-8 py-4 text-lg font-medium transition bg-red-400 rounded-lg hover:bg-red-500"
        >
          Find Medical Colleges
        </Link>
      </section>
    </div>
  );
};

export default Medicine;
