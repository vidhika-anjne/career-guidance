// Course information database schema
// This would typically be in your MySQL database

export const courseDatabase = {
    // Medical Courses
    "MBBS": {
        fullName: "Bachelor of Medicine, Bachelor of Surgery",
        category: "medical",
        level: "UG",
        duration: "5.5 years",
        description: "The most common medical degree, providing comprehensive training in medicine and surgery. Includes 1 year compulsory internship.",
        entranceExams: ["NEET UG", "AIIMS MBBS"],
        avgSalary: "₹6-15 LPA (Early Career)",
        topColleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER Puducherry", "MAMC Delhi"],
        eligibility: "12th with PCB (Physics, Chemistry, Biology) with minimum 50% marks",
        careerOptions: ["General Physician", "Specialist (after PG)", "Medical Researcher", "Healthcare Administrator"],
        skills: ["Clinical Knowledge", "Patient Care", "Ethics", "Communication", "Decision Making"]
    },
    "MD": {
        fullName: "Doctor of Medicine",
        category: "medical",
        level: "PG",
        duration: "3 years",
        description: "Postgraduate degree focusing on specialized fields like Pediatrics, Cardiology, Dermatology, etc.",
        entranceExams: ["NEET PG", "INI-CET"],
        avgSalary: "₹12-25 LPA",
        topColleges: ["AIIMS Delhi", "PGI Chandigarh", "CMC Vellore", "SGPGI Lucknow"],
        eligibility: "MBBS degree with compulsory internship completion",
        careerOptions: ["Specialist Doctor", "Medical Consultant", "Professor", "Researcher"],
        skills: ["Specialized Medical Knowledge", "Research", "Patient Management", "Teaching"]
    },
    "MS": {
        fullName: "Master of Surgery",
        category: "medical",
        level: "PG",
        duration: "3 years",
        description: "Postgraduate degree for advanced surgical training in various specialties like General Surgery, Orthopedics, ENT, etc.",
        entranceExams: ["NEET PG", "INI-CET"],
        avgSalary: "₹15-30 LPA",
        topColleges: ["AIIMS Delhi", "PGI Chandigarh", "CMC Vellore", "Seth GS Medical College"],
        eligibility: "MBBS degree with compulsory internship",
        careerOptions: ["Surgeon", "Surgical Consultant", "Professor of Surgery", "Researcher"],
        skills: ["Surgical Expertise", "Precision", "Crisis Management", "Physical Stamina", "Team Leadership"]
    },

    // Engineering Courses
    "B.Tech": {
        fullName: "Bachelor of Technology",
        category: "engineering",
        level: "UG",
        duration: "4 years",
        description: "Undergraduate engineering degree with specializations in CSE, ECE, ME, CE, EE, and more. Combines theoretical knowledge with practical application.",
        entranceExams: ["JEE Main", "JEE Advanced", "BITSAT", "State CETs"],
        avgSalary: "₹4-12 LPA (Campus Placements)",
        topColleges: ["IIT Delhi", "IIT Bombay", "IIT Madras", "BITS Pilani", "NIT Trichy"],
        eligibility: "12th with PCM (Physics, Chemistry, Mathematics) with minimum 75% marks",
        careerOptions: ["Software Engineer", "Data Scientist", "Product Manager", "Hardware Engineer", "Researcher"],
        skills: ["Problem Solving", "Programming", "Mathematics", "Analytical Thinking", "Innovation"]
    },
    "M.Tech": {
        fullName: "Master of Technology",
        category: "engineering",
        level: "PG",
        duration: "2 years",
        description: "Postgraduate engineering degree for specialization in areas like AI/ML, VLSI, Structural Engineering, Robotics, etc.",
        entranceExams: ["GATE", "University Specific Exams"],
        avgSalary: "₹8-20 LPA",
        topColleges: ["IIT Bombay", "IIT Delhi", "IIT Kanpur", "IISc Bangalore", "NIT Karnataka"],
        eligibility: "B.Tech/BE degree with minimum 60% marks",
        careerOptions: ["Senior Engineer", "Research Scientist", "Product Development Lead", "Professor"],
        skills: ["Advanced Technical Knowledge", "Research", "Innovation", "Project Management"]
    },

    // Commerce Courses
    "B.Com": {
        fullName: "Bachelor of Commerce",
        category: "commerce",
        level: "UG",
        duration: "3 years",
        description: "Undergraduate degree covering accounting, finance, taxation, economics, and business management fundamentals.",
        entranceExams: ["CUET", "DU JAT", "SET", "IPM"],
        avgSalary: "₹3-8 LPA",
        topColleges: ["SRCC Delhi", "St. Xavier's Mumbai", "Loyola Chennai", "Christ University"],
        eligibility: "12th with Commerce stream or any stream with minimum 50% marks",
        careerOptions: ["Accountant", "Financial Analyst", "Tax Consultant", "Auditor", "Business Analyst"],
        skills: ["Accounting", "Financial Analysis", "Business Management", "Communication", "Analytical Skills"]
    },
    "MBA": {
        fullName: "Master of Business Administration",
        category: "commerce",
        level: "PG",
        duration: "2 years",
        description: "Postgraduate management degree with specializations in Finance, Marketing, HR, Operations, IT, etc.",
        entranceExams: ["CAT", "XAT", "GMAT", "MAT", "CMAT"],
        avgSalary: "₹8-25 LPA",
        topColleges: ["IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "FMS Delhi", "XLRI Jamshedpur"],
        eligibility: "Bachelor's degree in any discipline with minimum 50% marks",
        careerOptions: ["Manager", "Consultant", "Financial Analyst", "Marketing Manager", "Entrepreneur"],
        skills: ["Leadership", "Strategic Thinking", "Communication", "Problem Solving", "Business Acumen"]
    },
    "CA": {
        fullName: "Chartered Accountancy",
        category: "commerce",
        level: "Professional",
        duration: "4-5 years",
        description: "Premier accounting qualification in India. Involves three levels: Foundation, Intermediate, and Final with articleship training.",
        entranceExams: ["CA Foundation", "CA Intermediate", "CA Final"],
        avgSalary: "₹6-20 LPA",
        topColleges: ["ICAI (Institute of Chartered Accountants of India)"],
        eligibility: "12th pass for Foundation; Graduation for Direct Entry",
        careerOptions: ["Chartered Accountant", "Tax Consultant", "Auditor", "CFO", "Financial Advisor"],
        skills: ["Accounting", "Auditing", "Taxation", "Financial Reporting", "Ethics", "Attention to Detail"]
    },

    // Technology Courses
    "BCA": {
        fullName: "Bachelor of Computer Applications",
        category: "technology",
        level: "UG",
        duration: "3 years",
        description: "Undergraduate degree focusing on computer applications, programming, software development, and IT fundamentals.",
        entranceExams: ["CUET", "University Specific", "IPU CET"],
        avgSalary: "₹3-7 LPA",
        topColleges: ["Christ University", "Symbiosis Pune", "Presidency Bangalore", "Amity University"],
        eligibility: "12th with Mathematics with minimum 50% marks",
        careerOptions: ["Software Developer", "Web Developer", "System Analyst", "Database Administrator"],
        skills: ["Programming", "Web Development", "Database Management", "Problem Solving"]
    },
    "MCA": {
        fullName: "Master of Computer Applications",
        category: "technology",
        level: "PG",
        duration: "2-3 years",
        description: "Postgraduate degree in computer applications with advanced programming, software engineering, and emerging technologies.",
        entranceExams: ["NIMCET", "JNU MCA", "BIT MCA", "University Specific"],
        avgSalary: "₹5-12 LPA",
        topColleges: ["NIT Trichy", "NIT Warangal", "JNU Delhi", "BIT Mesra", "VIT Vellore"],
        eligibility: "BCA/B.Sc IT/B.Sc CS or equivalent with minimum 55% marks",
        careerOptions: ["Software Engineer", "Full Stack Developer", "Data Scientist", "IT Consultant"],
        skills: ["Advanced Programming", "Software Architecture", "Cloud Computing", "AI/ML"]
    },

    // Arts Courses
    "BA": {
        fullName: "Bachelor of Arts",
        category: "arts",
        level: "UG",
        duration: "3 years",
        description: "Undergraduate degree in humanities and social sciences with specializations in English, History, Psychology, Sociology, etc.",
        entranceExams: ["CUET", "DU JAT", "University Specific"],
        avgSalary: "₹2.5-6 LPA",
        topColleges: ["St. Stephen's Delhi", "Lady Shri Ram Delhi", "Presidency Kolkata", "Christ University"],
        eligibility: "12th in any stream with minimum 50% marks",
        careerOptions: ["Content Writer", "Journalist", "Teacher", "Civil Services", "Social Worker"],
        skills: ["Communication", " Critical Thinking", "Research", "Writing", "Cultural Awareness"]
    },
    "MA": {
        fullName: "Master of Arts",
        category: "arts",
        level: "PG",
        duration: "2 years",
        description: "Postgraduate degree in humanities with specializations in English Literature, History, Political Science, Psychology, etc.",
        entranceExams: ["UGC NET", "University Specific Entrance"],
        avgSalary: "₹3-8 LPA",
        topColleges: ["JNU Delhi", "DU Delhi", "Jadavpur University", "Presidency Kolkata"],
        eligibility: "BA in relevant discipline with minimum 50% marks",
        careerOptions: ["Professor/Lecturer", "Researcher", "Author", "Curator", "Policy Analyst"],
        skills: ["Research", "Analysis", "Writing", "Teaching", "Theoretical Knowledge"]
    },

    // Design Courses
    "B.Des": {
        fullName: "Bachelor of Design",
        category: "design",
        level: "UG",
        duration: "4 years",
        description: "Professional undergraduate design degree with specializations in Product Design, Fashion Design, Communication Design, etc.",
        entranceExams: ["UCEED", "NID DAT", "NIFT Entrance", "CEED"],
        avgSalary: "₹3-10 LPA",
        topColleges: ["NID Ahmedabad", "NIFT Delhi", "IIT Bombay IDC", "Srishti Bangalore"],
        eligibility: "12th in any stream with creative aptitude",
        careerOptions: ["Product Designer", "Fashion Designer", "UX/UI Designer", "Graphic Designer", "Design Consultant"],
        skills: ["Creativity", "Visualization", "Software Tools", "User Research", "Innovation"]
    },
    "M.Des": {
        fullName: "Master of Design",
        category: "design",
        level: "PG",
        duration: "2 years",
        description: "Postgraduate design degree for advanced specialization in design thinking, research, and professional practice.",
        entranceExams: ["CEED", "NID DAT", "University Specific"],
        avgSalary: "₹6-15 LPA",
        topColleges: ["NID Ahmedabad", "IIT Bombay IDC", "IIT Guwahati", "DJ Academy"],
        eligibility: "B.Des or equivalent degree in design",
        careerOptions: ["Senior Designer", "Design Director", "UX Lead", "Design Researcher", "Entrepreneur"],
        skills: ["Advanced Design", "Research", "Leadership", "Strategic Thinking", "Innovation Management"]
    },

    // Add more courses as needed
    "BDS": {
        fullName: "Bachelor of Dental Surgery",
        category: "medical",
        level: "UG",
        duration: "5 years",
        description: "Professional dental degree focusing on oral health, dental care, and surgical procedures. Includes 1 year internship.",
        entranceExams: ["NEET UG"],
        avgSalary: "₹4-10 LPA",
        topColleges: ["Manipal College", "Maulana Azad Institute", "Govt Dental College Mumbai"],
        eligibility: "12th with PCB with minimum 50% marks",
        careerOptions: ["Dentist", "Orthodontist", "Oral Surgeon", "Dental Consultant", "Researcher"],
        skills: ["Precision", "Patient Care", "Manual Dexterity", "Communication", "Clinical Knowledge"]
    },

    "BAMS": {
        fullName: "Bachelor of Ayurvedic Medicine and Surgery",
        category: "medical",
        level: "UG",
        duration: "5.5 years",
        description: "Undergraduate program in Ayurvedic medicine focusing on holistic healthcare using traditional Indian medicine principles.",
        entranceExams: ["NEET UG"],
        avgSalary: "₹3-8 LPA",
        topColleges: ["Banaras Hindu University", "Gujarat Ayurved University", "National Institute of Ayurveda"],
        eligibility: "12th with PCB with minimum 50% marks",
        careerOptions: ["Ayurvedic Practitioner", "Wellness Consultant", "Researcher", "Pharmacist"],
        skills: ["Traditional Medicine", "Patient Care", "Herbal Knowledge", "Holistic Approach"]
    },

    "BBA": {
        fullName: "Bachelor of Business Administration",
        category: "commerce",
        level: "UG",
        duration: "3 years",
        description: "Undergraduate business management degree covering marketing, finance, HR, operations, and entrepreneurship.",
        entranceExams: ["CUET", "IPM", "DU JAT", "NPAT"],
        avgSalary: "₹3-8 LPA",
        topColleges: ["Shaheed Sukhdev College Delhi", "Christ University", "Symbiosis Pune", "NMIMS Mumbai"],
        eligibility: "12th in any stream with minimum 50% marks",
        careerOptions: ["Business Analyst", "Marketing Executive", "HR Executive", "Operations Manager", "Entrepreneur"],
        skills: ["Business Management", "Communication", "Leadership", "Analytical Thinking", "Teamwork"]
    },

    "Ph.D": {
        fullName: "Doctor of Philosophy",
        category: "research",
        level: "Doctoral",
        duration: "3-5 years",
        description: "Highest academic degree involving original research in any field. Requires thesis submission and defense.",
        entranceExams: ["UGC NET", "GATE", "University Specific Research Entrance"],
        avgSalary: "₹6-15 LPA (Academia), Variable (Industry)",
        topColleges: ["IISc Bangalore", "IITs", "JNU", "Delhi University", "Tata Institute"],
        eligibility: "Master's degree in relevant field with minimum 55% marks",
        careerOptions: ["Professor", "Research Scientist", "Industry R&D", "Consultant", "Policy Researcher"],
        skills: ["Research", "Critical Thinking", "Writing", "Data Analysis", "Subject Expertise"]
    },

    // Science Courses
    "B.Sc": {
        fullName: "Bachelor of Science",
        category: "science",
        level: "UG",
        duration: "3 years",
        description: "Undergraduate science degree with specializations in Physics, Chemistry, Mathematics, Biology, Computer Science, etc. Provides strong theoretical foundation and research skills.",
        entranceExams: ["CUET", "University Specific Exams", "State Level Entrance"],
        avgSalary: "₹3-8 LPA",
        topColleges: ["St. Stephen's Delhi", "Presidency Kolkata", "Loyola Chennai", "Christ University", "Fergusson Pune"],
        eligibility: "12th with PCM/PCB with minimum 50% marks",
        careerOptions: ["Research Assistant", "Lab Technician", "Data Analyst", "Teacher", "Further Studies (M.Sc/M.Tech)"],
        skills: ["Scientific Method", "Research", "Data Analysis", "Laboratory Skills", "Critical Thinking"]
    },
    "M.Sc": {
        fullName: "Master of Science",
        category: "science",
        level: "PG",
        duration: "2 years",
        description: "Postgraduate science degree for advanced specialization and research in specific scientific disciplines. Gateway to Ph.D and research careers.",
        entranceExams: ["JAM", "CUET PG", "University Specific", "GATE"],
        avgSalary: "₹4-12 LPA",
        topColleges: ["IITs", "IISc Bangalore", "JNU Delhi", "TIFR Mumbai", "IISER Pune"],
        eligibility: "B.Sc in relevant discipline with minimum 55% marks",
        careerOptions: ["Research Scientist", "Professor", "Data Scientist", "Lab Manager", "Quality Analyst"],
        skills: ["Advanced Research", "Data Analysis", "Scientific Writing", "Statistics", "Experimentation"]
    },
    "B.E": {
        fullName: "Bachelor of Engineering",
        category: "engineering",
        level: "UG",
        duration: "4 years",
        description: "Equivalent to B.Tech, focusing on engineering principles with specializations in various fields. More theory-oriented approach to engineering education.",
        entranceExams: ["JEE Main", "State CETs", "BITSAT", "VITEEE"],
        avgSalary: "₹4-12 LPA",
        topColleges: ["Anna University", "BITS Pilani", "VIT Vellore", "Manipal", "PES Bangalore"],
        eligibility: "12th with PCM with minimum 75% marks",
        careerOptions: ["Engineer", "Project Manager", "Technical Consultant", "Entrepreneur", "Researcher"],
        skills: ["Engineering Principles", "Problem Solving", "Design", "Mathematics", "Technical Communication"]
    },
    "BFA": {
        fullName: "Bachelor of Fine Arts",
        category: "arts",
        level: "UG",
        duration: "3-4 years",
        description: "Professional degree in visual arts including painting, sculpture, photography, digital arts, and other creative disciplines.",
        entranceExams: ["CUET", "NID DAT", "University Specific Portfolio Review"],
        avgSalary: "₹2.5-10 LPA",
        topColleges: ["Jamia Millia Islamia", "BHU Varanasi", "MS University Baroda", "Kala Bhavana Santiniketan"],
        eligibility: "12th in any stream with creative aptitude and portfolio",
        careerOptions: ["Artist", "Illustrator", "Art Director", "Curator", "Art Teacher", "Freelance Artist"],
        skills: ["Artistic Expression", "Visual Communication", "Creativity", "Various Art Mediums", "Art History"]
    },
    "MFA": {
        fullName: "Master of Fine Arts",
        category: "arts",
        level: "PG",
        duration: "2 years",
        description: "Terminal degree in fine arts focusing on advanced artistic practice, theory, and professional development in chosen art discipline.",
        entranceExams: ["Portfolio Review", "University Specific Exams"],
        avgSalary: "₹3-12 LPA",
        topColleges: ["Jamia Millia Islamia", "MS University Baroda", "Visva-Bharati", "BHU"],
        eligibility: "BFA or equivalent with portfolio",
        careerOptions: ["Professional Artist", "Art Professor", "Gallery Owner", "Art Critic", "Creative Director"],
        skills: ["Advanced Art Techniques", "Conceptual Development", "Art Theory", "Critique", "Exhibition Management"]
    },

    // Additional professional courses
    "CFA": {
        fullName: "Chartered Financial Analyst",
        category: "commerce",
        level: "Professional",
        duration: "2-4 years",
        description: "Globally recognized professional credential for investment and financial analysis. Three-level examination system with work experience requirement.",
        entranceExams: ["CFA Level I", "CFA Level II", "CFA Level III"],
        avgSalary: "₹8-30 LPA",
        topColleges: ["CFA Institute (Global Program)"],
        eligibility: "Bachelor's degree or final year of graduation",
        careerOptions: ["Portfolio Manager", "Investment Analyst", "Risk Manager", "Financial Advisor", "Research Analyst"],
        skills: ["Financial Analysis", "Portfolio Management", "Ethics", "Quantitative Methods", "Economics"]
    },
    "FRM": {
        fullName: "Financial Risk Manager",
        category: "commerce",
        level: "Professional",
        duration: "1-2 years",
        description: "Leading certification for risk management professionals. Two-part examination focusing on quantitative risk analysis and management.",
        entranceExams: ["FRM Part I", "FRM Part II"],
        avgSalary: "₹7-25 LPA",
        topColleges: ["GARP (Global Program)"],
        eligibility: "Bachelor's degree with 2 years work experience",
        careerOptions: ["Risk Manager", "Credit Risk Analyst", "Market Risk Analyst", "Compliance Officer"],
        skills: ["Risk Analysis", "Quantitative Methods", "Financial Markets", "Derivatives", "Regulations"]
    }
};
