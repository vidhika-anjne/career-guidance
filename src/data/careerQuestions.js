/**
 * Career Assessment Questions - UPDATED School Questions
 * 19 comprehensive questions for Class 8-12 students
 * Organized in 3 sections: Interest, Ability, Future
 * CS508 Minor Project I
 */

// =====================================================
// SCHOOL STUDENT QUESTIONS (Class 8-12) - 19 Questions
// =====================================================

export const schoolQuestions = [
    // 🟢 SECTION 1: INTEREST & PREFERENCE (Q1–Q7)
    {
        id: 1,
        category: 'school',
        question_text: "How do you prefer to spend your free time?",
        question_type: 'interest',
        difficulty_level: 'easy',
        weight: 1.00,
        options: [
            {
                text: "Solving maths puzzles or coding",
                score_mapping: { science: 3, commerce: 1, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Drawing, music, or writing",
                score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 3 }
            },
            {
                text: "Business games or trading",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "Spending time with nature, animals, or helping people",
                score_mapping: { science: 2, commerce: 0, technology: 0, arts: 2, design: 1 }
            }
        ]
    },
    {
        id: 2,
        category: 'school',
        question_text: "What type of content do you mostly watch on YouTube or reels?",
        question_type: 'interest',
        difficulty_level: 'easy',
        weight: 1.00,
        options: [
            {
                text: "Technology, gadgets, and science experiments",
                score_mapping: { science: 3, commerce: 0, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Startups, money, and the stock market",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "History, psychology, and social topics",
                score_mapping: { science: 0, commerce: 1, technology: 0, arts: 3, design: 0 }
            },
            {
                text: "Health, medical, and biology-related content",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 1, design: 0 }
            }
        ]
    },
    {
        id: 3,
        category: 'school',
        question_text: "Which type of work do you find most interesting?",
        question_type: 'interest',
        difficulty_level: 'medium',
        weight: 1.20,
        options: [
            {
                text: "Solving problems and logical challenges",
                score_mapping: { science: 3, commerce: 1, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Creating something new or creative",
                score_mapping: { science: 1, commerce: 0, technology: 2, arts: 3, design: 3 }
            },
            {
                text: "Planning, organizing, and managing things",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 1, design: 1 }
            },
            {
                text: "Caring for others or doing research",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 2, design: 0 }
            }
        ]
    },
    {
        id: 4,
        category: 'school',
        question_text: "Which school subject do you not find boring?",
        question_type: 'aptitude',
        difficulty_level: 'easy',
        weight: 1.30,
        options: [
            {
                text: "Mathematics or Physics",
                score_mapping: { science: 3, commerce: 2, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Accounts or Economics",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "Hindi, English, or Social Studies",
                score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 1 }
            },
            {
                text: "Biology or Environmental Studies",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 1, design: 0 }
            }
        ]
    },
    {
        id: 5,
        category: 'school',
        question_text: "If you are given a project, what would you choose?",
        question_type: 'interest',
        difficulty_level: 'medium',
        weight: 1.10,
        options: [
            {
                text: "A technical or working model",
                score_mapping: { science: 3, commerce: 0, technology: 3, arts: 0, design: 2 }
            },
            {
                text: "A business plan",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "A presentation or storytelling project",
                score_mapping: { science: 0, commerce: 1, technology: 0, arts: 3, design: 2 }
            },
            {
                text: "A science experiment",
                score_mapping: { science: 3, commerce: 0, technology: 1, arts: 0, design: 0 }
            }
        ]
    },
    {
        id: 6,
        category: 'school',
        question_text: "Which type of people do you admire the most?",
        question_type: 'personality',
        difficulty_level: 'easy',
        weight: 1.00,
        options: [
            {
                text: "Scientists or Engineers",
                score_mapping: { science: 3, commerce: 0, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Entrepreneurs or Business leaders",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "Writers, Teachers, or Speakers",
                score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 1 }
            },
            {
                text: "Doctors or Researchers",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 1, design: 0 }
            }
        ]
    },
    {
        id: 7,
        category: 'school',
        question_text: "Which activity sounds most exciting to you?",
        question_type: 'interest',
        difficulty_level: 'medium',
        weight: 1.20,
        options: [
            {
                text: "Building machines or software",
                score_mapping: { science: 2, commerce: 0, technology: 3, arts: 0, design: 2 }
            },
            {
                text: "Buying, selling, and making profit",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "Expressing ideas or explaining concepts",
                score_mapping: { science: 0, commerce: 1, technology: 0, arts: 3, design: 2 }
            },
            {
                text: "Studying the human body or life sciences",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 0, design: 0 }
            }
        ]
    },

    // 🟡 SECTION 2: ABILITY & COMFORT (Q8–Q13)
    {
        id: 8,
        category: 'school',
        question_text: "Which task feels easiest for you?",
        question_type: 'aptitude',
        difficulty_level: 'medium',
        weight: 1.20,
        options: [
            {
                text: "Calculations and numerical work",
                score_mapping: { science: 3, commerce: 3, technology: 3, arts: 0, design: 0 }
            },
            {
                text: "Convincing or explaining ideas to others",
                score_mapping: { science: 0, commerce: 2, technology: 0, arts: 3, design: 1 }
            },
            {
                text: "Creative thinking and imagination",
                score_mapping: { science: 1, commerce: 0, technology: 2, arts: 3, design: 3 }
            },
            {
                text: "Observation and remembering details",
                score_mapping: { science: 3, commerce: 1, technology: 1, arts: 2, design: 1 }
            }
        ]
    },
    {
        id: 9,
        category: 'school',
        question_text: "In exams, which section do you usually perform best in?",
        question_type: 'aptitude',
        difficulty_level: 'easy',
        weight: 1.30,
        options: [
            {
                text: "Numerical or problem-solving questions",
                score_mapping: { science: 3, commerce: 3, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Case studies and application-based questions",
                score_mapping: { science: 1, commerce: 3, technology: 1, arts: 2, design: 1 }
            },
            {
                text: "Theory or descriptive answers",
                score_mapping: { science: 2, commerce: 1, technology: 0, arts: 3, design: 0 }
            },
            {
                text: "Diagrams and biology-related questions",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 1, design: 2 }
            }
        ]
    },
    {
        id: 10,
        category: 'school',
        question_text: "How do you prefer to learn new things?",
        question_type: 'work_style',
        difficulty_level: 'easy',
        weight: 1.00,
        options: [
            {
                text: "By practicing repeatedly",
                score_mapping: { science: 2, commerce: 2, technology: 3, arts: 1, design: 2 }
            },
            {
                text: "By learning through examples",
                score_mapping: { science: 2, commerce: 3, technology: 2, arts: 1, design: 1 }
            },
            {
                text: "By reading and writing",
                score_mapping: { science: 1, commerce: 1, technology: 0, arts: 3, design: 1 }
            },
            {
                text: "By visuals, diagrams, and demonstrations",
                score_mapping: { science: 3, commerce: 0, technology: 1, arts: 2, design: 3 }
            }
        ]
    },
    {
        id: 11,
        category: 'school',
        question_text: "How do you react under pressure?",
        question_type: 'personality',
        difficulty_level: 'medium',
        weight: 1.10,
        options: [
            {
                text: "I think logically and find solutions",
                score_mapping: { science: 3, commerce: 2, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "I plan and organize tasks",
                score_mapping: { science: 1, commerce: 3, technology: 2, arts: 1, design: 1 }
            },
            {
                text: "I stay calm and explain things clearly",
                score_mapping: { science: 1, commerce: 1, technology: 0, arts: 3, design: 1 }
            },
            {
                text: "I work slowly but with accuracy",
                score_mapping: { science: 3, commerce: 1, technology: 1, arts: 2, design: 2 }
            }
        ]
    },
    {
        id: 12,
        category: 'school',
        question_text: "What role do you usually play in a group?",
        question_type: 'work_style',
        difficulty_level: 'easy',
        weight: 1.00,
        options: [
            {
                text: "Technical problem-solver",
                score_mapping: { science: 3, commerce: 0, technology: 3, arts: 0, design: 2 }
            },
            {
                text: "Leader or planner",
                score_mapping: { science: 1, commerce: 3, technology: 1, arts: 1, design: 1 }
            },
            {
                text: "Communicator or presenter",
                score_mapping: { science: 0, commerce: 2, technology: 0, arts: 3, design: 2 }
            },
            {
                text: "Supporter or analyst",
                score_mapping: { science: 3, commerce: 2, technology: 1, arts: 2, design: 1 }
            }
        ]
    },
    {
        id: 13,
        category: 'school',
        question_text: "In which area do you feel most confident?",
        question_type: 'aptitude',
        difficulty_level: 'medium',
        weight: 1.20,
        options: [
            {
                text: "Numbers and logical reasoning",
                score_mapping: { science: 3, commerce: 3, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Money-related decisions",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "Communication skills",
                score_mapping: { science: 0, commerce: 2, technology: 0, arts: 3, design: 2 }
            },
            {
                text: "Science and biology concepts",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 1, design: 0 }
            }
        ]
    },

    // 🔵 SECTION 3: FUTURE IMAGINATION (Q14–Q19)
    {
        id: 14,
        category: 'school',
        question_text: "Without any pressure, what would you like to become in the future?",
        question_type: 'interest',
        difficulty_level: 'medium',
        weight: 1.50,
        options: [
            {
                text: "Engineer or Scientist",
                score_mapping: { science: 3, commerce: 0, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Business owner, CA, or Finance professional",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "Teacher, Writer, or Lawyer",
                score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 1 }
            },
            {
                text: "Doctor or Healthcare professional",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 1, design: 0 }
            }
        ]
    },
    {
        id: 15,
        category: 'school',
        question_text: "What does your ideal workplace look like?",
        question_type: 'personality',
        difficulty_level: 'easy',
        weight: 1.00,
        options: [
            {
                text: "A laboratory or technology company",
                score_mapping: { science: 3, commerce: 0, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "An office or startup environment",
                score_mapping: { science: 0, commerce: 3, technology: 2, arts: 0, design: 1 }
            },
            {
                text: "A school, media house, or court",
                score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 2 }
            },
            {
                text: "A hospital or research center",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 1, design: 0 }
            }
        ]
    },
    {
        id: 16,
        category: 'school',
        question_text: "What kind of impact do you want to create?",
        question_type: 'personality',
        difficulty_level: 'medium',
        weight: 1.20,
        options: [
            {
                text: "Through technology and innovation",
                score_mapping: { science: 2, commerce: 0, technology: 3, arts: 0, design: 2 }
            },
            {
                text: "Through economic growth and business",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "Through social change and awareness",
                score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 1 }
            },
            {
                text: "Through healthcare and well-being",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 2, design: 0 }
            }
        ]
    },
    {
        id: 17,
        category: 'school',
        question_text: "What motivates you the most?",
        question_type: 'personality',
        difficulty_level: 'medium',
        weight: 1.30,
        options: [
            {
                text: "Innovation and new ideas",
                score_mapping: { science: 2, commerce: 1, technology: 3, arts: 1, design: 3 }
            },
            {
                text: "Profit and business growth",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "Respect, influence, and recognition",
                score_mapping: { science: 1, commerce: 2, technology: 0, arts: 3, design: 2 }
            },
            {
                text: "Helping and improving lives",
                score_mapping: { science: 3, commerce: 0, technology: 1, arts: 2, design: 1 }
            }
        ]
    },
    {
        id: 18,
        category: 'school',
        question_text: "Are you ready for long-term studies if required?",
        question_type: 'work_style',
        difficulty_level: 'easy',
        weight: 1.00,
        options: [
            {
                text: "Yes (5–7 years)",
                score_mapping: { science: 3, commerce: 1, technology: 2, arts: 2, design: 1 }
            },
            {
                text: "Moderately (3–5 years)",
                score_mapping: { science: 2, commerce: 3, technology: 3, arts: 2, design: 2 }
            },
            {
                text: "It depends",
                score_mapping: { science: 1, commerce: 2, technology: 2, arts: 2, design: 2 }
            },
            {
                text: "Yes, if the work is meaningful",
                score_mapping: { science: 3, commerce: 1, technology: 1, arts: 3, design: 2 }
            }
        ]
    },
    {
        id: 19,
        category: 'school',
        question_text: "What is your top priority in a career?",
        question_type: 'personality',
        difficulty_level: 'medium',
        weight: 1.40,
        options: [
            {
                text: "Skills and technology",
                score_mapping: { science: 2, commerce: 0, technology: 3, arts: 0, design: 2 }
            },
            {
                text: "Financial stability",
                score_mapping: { science: 1, commerce: 3, technology: 2, arts: 1, design: 1 }
            },
            {
                text: "Job security",
                score_mapping: { science: 2, commerce: 2, technology: 1, arts: 2, design: 1 }
            },
            {
                text: "Service and knowledge",
                score_mapping: { science: 3, commerce: 0, technology: 1, arts: 3, design: 1 }
            }
        ]
    }
];

// =====================================================
// COLLEGE STUDENT QUESTIONS - 26 Dynamic Questions
// Stream-Based Assessment with Dynamic Flow
// =====================================================

export const collegeQuestions = [
    // 🔴 SECTION 0: MANDATORY STREAM SELECTION (Q1)
    {
        id: 101,
        category: 'college',
        question_text: "Which stream are you currently studying or have completed?",
        question_type: 'personality', // Changed from 'stream_selection' to match DB ENUM
        difficulty_level: 'easy',
        weight: 2.00,
        determines_flow: true,
        options: [
            {
                text: "Engineering / Technology",
                score_mapping: { science: 2, commerce: 0, technology: 3, arts: 0, design: 1 },
                next_section: 'engineering'
            },
            {
                text: "Medical / Life Sciences",
                score_mapping: { science: 3, commerce: 0, technology: 1, arts: 0, design: 0 },
                next_section: 'medical'
            },
            {
                text: "Commerce / Management",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 1, design: 0 },
                next_section: 'commerce'
            },
            {
                text: "Arts / Humanities",
                score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 1 },
                next_section: 'arts'
            },
            {
                text: "Design / Creative Fields",
                score_mapping: { science: 0, commerce: 0, technology: 1, arts: 1, design: 3 },
                next_section: 'design'
            }
        ]
    },

    // 🔵 SECTION 1: GOAL CLARITY - COMMON FOR ALL (Q2-Q4)
    {
        id: 102,
        category: 'college',
        question_text: "What is your primary goal right now?",
        question_type: 'interest', // Changed from 'goal' to match DB ENUM
        difficulty_level: 'medium',
        weight: 1.50,
        section: 'common',
        options: [
            {
                text: "Specialize further in my current field",
                score_mapping: { science: 3, commerce: 2, technology: 3, arts: 2, design: 2 }
            },
            {
                text: "Explore multiple career options",
                score_mapping: { science: 1, commerce: 2, technology: 2, arts: 3, design: 2 }
            },
            {
                text: "Switch to a different field",
                score_mapping: { science: 1, commerce: 1, technology: 1, arts: 1, design: 1 }
            },
            {
                text: "Prepare for higher studies (India / Abroad)",
                score_mapping: { science: 3, commerce: 2, technology: 2, arts: 2, design: 2 }
            }
        ]
    },
    {
        id: 103,
        category: 'college',
        question_text: "What matters most to you at this stage?",
        question_type: 'personality', // Changed from 'values' to match DB ENUM
        difficulty_level: 'medium',
        weight: 1.30,
        section: 'common',
        options: [
            {
                text: "High-paying career",
                score_mapping: { science: 1, commerce: 3, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Job stability and security",
                score_mapping: { science: 2, commerce: 3, technology: 2, arts: 1, design: 1 }
            },
            {
                text: "Personal interest & satisfaction",
                score_mapping: { science: 2, commerce: 1, technology: 2, arts: 3, design: 3 }
            },
            {
                text: "Social impact and meaningful work",
                score_mapping: { science: 3, commerce: 0, technology: 1, arts: 3, design: 2 }
            }
        ]
    },
    {
        id: 104,
        category: 'college',
        question_text: "What kind of work environment do you prefer?",
        question_type: 'work_style',
        difficulty_level: 'easy',
        weight: 1.10,
        section: 'common',
        options: [
            {
                text: "Corporate / Tech company",
                score_mapping: { science: 1, commerce: 3, technology: 3, arts: 1, design: 2 }
            },
            {
                text: "Research lab / Academia",
                score_mapping: { science: 3, commerce: 0, technology: 2, arts: 2, design: 1 }
            },
            {
                text: "Startup / Entrepreneurial",
                score_mapping: { science: 1, commerce: 3, technology: 3, arts: 2, design: 3 }
            },
            {
                text: "Public sector / Social sector",
                score_mapping: { science: 2, commerce: 1, technology: 0, arts: 3, design: 1 }
            }
        ]
    },

    // 🟠 SECTION 2A: ENGINEERING / TECHNOLOGY (Q5-Q8)
    {
        id: 105,
        category: 'college',
        question_text: "Which subjects do you enjoy the most?",
        question_type: 'interest',
        difficulty_level: 'medium',
        weight: 1.40,
        section: 'engineering',
        stream_filter: 'engineering',
        options: [
            {
                text: "Programming & Algorithms",
                score_mapping: { science: 1, commerce: 0, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Electronics / Hardware",
                score_mapping: { science: 3, commerce: 0, technology: 2, arts: 0, design: 1 }
            },
            {
                text: "Mathematics & Logic",
                score_mapping: { science: 3, commerce: 2, technology: 3, arts: 0, design: 0 }
            },
            {
                text: "Design & Systems",
                score_mapping: { science: 2, commerce: 0, technology: 2, arts: 0, design: 3 }
            }
        ]
    },
    {
        id: 106,
        category: 'college',
        question_text: "What type of projects excite you?",
        question_type: 'interest',
        difficulty_level: 'medium',
        weight: 1.30,
        section: 'engineering',
        stream_filter: 'engineering',
        options: [
            {
                text: "Software applications / websites",
                score_mapping: { science: 0, commerce: 1, technology: 3, arts: 0, design: 2 }
            },
            {
                text: "AI, ML, or data-based projects",
                score_mapping: { science: 2, commerce: 2, technology: 3, arts: 0, design: 0 }
            },
            {
                text: "Core engineering (electronics, mechanical)",
                score_mapping: { science: 3, commerce: 0, technology: 2, arts: 0, design: 1 }
            },
            {
                text: "Research-oriented or experimental work",
                score_mapping: { science: 3, commerce: 0, technology: 2, arts: 1, design: 1 }
            }
        ]
    },
    {
        id: 107,
        category: 'college',
        question_text: "Which role do you see yourself in?",
        question_type: 'aptitude',
        difficulty_level: 'medium',
        weight: 1.50,
        section: 'engineering',
        stream_filter: 'engineering',
        options: [
            {
                text: "Software Developer / Engineer",
                score_mapping: { science: 0, commerce: 1, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Data Scientist / AI Engineer",
                score_mapping: { science: 2, commerce: 2, technology: 3, arts: 0, design: 0 }
            },
            {
                text: "Core Engineer (Mechanical/Electrical)",
                score_mapping: { science: 3, commerce: 0, technology: 2, arts: 0, design: 1 }
            },
            {
                text: "Researcher / Academician",
                score_mapping: { science: 3, commerce: 0, technology: 1, arts: 2, design: 0 }
            }
        ]
    },
    {
        id: 108,
        category: 'college',
        question_text: "Are you interested in higher studies?",
        question_type: 'goal',
        difficulty_level: 'easy',
        weight: 1.20,
        section: 'engineering',
        stream_filter: 'engineering',
        options: [
            {
                text: "M.Tech / MS",
                score_mapping: { science: 3, commerce: 0, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "MBA / Management",
                score_mapping: { science: 0, commerce: 3, technology: 2, arts: 0, design: 0 }
            },
            {
                text: "PhD / Research",
                score_mapping: { science: 3, commerce: 0, technology: 2, arts: 1, design: 0 }
            },
            {
                text: "Job after graduation",
                score_mapping: { science: 1, commerce: 2, technology: 2, arts: 1, design: 2 }
            }
        ]
    },

    // 🟢 SECTION 2B: MEDICAL / LIFE SCIENCES (Q5-Q8)
    {
        id: 109,
        category: 'college',
        question_text: "Which area interests you the most?",
        question_type: 'interest',
        difficulty_level: 'medium',
        weight: 1.40,
        section: 'medical',
        stream_filter: 'medical',
        options: [
            {
                text: "Clinical practice",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 1, design: 0 }
            },
            {
                text: "Research & biotechnology",
                score_mapping: { science: 3, commerce: 0, technology: 2, arts: 0, design: 0 }
            },
            {
                text: "Public health & policy",
                score_mapping: { science: 2, commerce: 1, technology: 0, arts: 3, design: 0 }
            },
            {
                text: "Healthcare management",
                score_mapping: { science: 1, commerce: 3, technology: 1, arts: 1, design: 0 }
            }
        ]
    },
    {
        id: 110,
        category: 'college',
        question_text: "How comfortable are you with long study durations?",
        question_type: 'work_style',
        difficulty_level: 'easy',
        weight: 1.20,
        section: 'medical',
        stream_filter: 'medical',
        options: [
            {
                text: "Very comfortable (8–10 years)",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 1, design: 0 }
            },
            {
                text: "Moderate (5–7 years)",
                score_mapping: { science: 3, commerce: 1, technology: 1, arts: 2, design: 1 }
            },
            {
                text: "Prefer shorter courses",
                score_mapping: { science: 1, commerce: 2, technology: 2, arts: 2, design: 2 }
            },
            {
                text: "Want non-clinical roles",
                score_mapping: { science: 2, commerce: 2, technology: 2, arts: 2, design: 1 }
            }
        ]
    },
    {
        id: 111,
        category: 'college',
        question_text: "What type of impact do you want?",
        question_type: 'values',
        difficulty_level: 'medium',
        weight: 1.30,
        section: 'medical',
        stream_filter: 'medical',
        options: [
            {
                text: "Treating patients directly",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 2, design: 0 }
            },
            {
                text: "Discovering new medicines",
                score_mapping: { science: 3, commerce: 0, technology: 2, arts: 0, design: 0 }
            },
            {
                text: "Improving healthcare systems",
                score_mapping: { science: 2, commerce: 2, technology: 1, arts: 3, design: 0 }
            },
            {
                text: "Managing hospitals / pharma companies",
                score_mapping: { science: 1, commerce: 3, technology: 1, arts: 1, design: 0 }
            }
        ]
    },
    {
        id: 112,
        category: 'college',
        question_text: "Your preferred future role?",
        question_type: 'aptitude',
        difficulty_level: 'medium',
        weight: 1.50,
        section: 'medical',
        stream_filter: 'medical',
        options: [
            {
                text: "Doctor / Specialist",
                score_mapping: { science: 3, commerce: 0, technology: 0, arts: 1, design: 0 }
            },
            {
                text: "Research Scientist",
                score_mapping: { science: 3, commerce: 0, technology: 2, arts: 0, design: 0 }
            },
            {
                text: "Public Health Expert",
                score_mapping: { science: 2, commerce: 1, technology: 0, arts: 3, design: 0 }
            },
            {
                text: "Healthcare Administrator",
                score_mapping: { science: 1, commerce: 3, technology: 1, arts: 1, design: 0 }
            }
        ]
    },

    // 🟡 SECTION 2C: COMMERCE / MANAGEMENT (Q5-Q8)
    {
        id: 113,
        category: 'college',
        question_text: "Which subject do you find most interesting?",
        question_type: 'interest',
        difficulty_level: 'medium',
        weight: 1.40,
        section: 'commerce',
        stream_filter: 'commerce',
        options: [
            {
                text: "Accounting & Finance",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "Marketing & Sales",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 2, design: 2 }
            },
            {
                text: "Economics & Analytics",
                score_mapping: { science: 2, commerce: 3, technology: 2, arts: 0, design: 0 }
            },
            {
                text: "Business Strategy",
                score_mapping: { science: 1, commerce: 3, technology: 2, arts: 1, design: 1 }
            }
        ]
    },
    {
        id: 114,
        category: 'college',
        question_text: "What type of career appeals to you?",
        question_type: 'aptitude',
        difficulty_level: 'medium',
        weight: 1.50,
        section: 'commerce',
        stream_filter: 'commerce',
        options: [
            {
                text: "Corporate finance / CA / CFA",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "Business management / MBA",
                score_mapping: { science: 0, commerce: 3, technology: 2, arts: 1, design: 1 }
            },
            {
                text: "Entrepreneurship / Startup",
                score_mapping: { science: 0, commerce: 3, technology: 3, arts: 1, design: 2 }
            },
            {
                text: "Government or PSU roles",
                score_mapping: { science: 1, commerce: 2, technology: 0, arts: 2, design: 0 }
            }
        ]
    },
    {
        id: 115,
        category: 'college',
        question_text: "Your strength lies in?",
        question_type: 'aptitude',
        difficulty_level: 'medium',
        weight: 1.30,
        section: 'commerce',
        stream_filter: 'commerce',
        options: [
            {
                text: "Numbers and analysis",
                score_mapping: { science: 2, commerce: 3, technology: 2, arts: 0, design: 0 }
            },
            {
                text: "Communication & persuasion",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 3, design: 2 }
            },
            {
                text: "Decision-making & leadership",
                score_mapping: { science: 1, commerce: 3, technology: 2, arts: 2, design: 1 }
            },
            {
                text: "Market understanding",
                score_mapping: { science: 0, commerce: 3, technology: 2, arts: 2, design: 2 }
            }
        ]
    },
    {
        id: 116,
        category: 'college',
        question_text: "Future plan?",
        question_type: 'goal',
        difficulty_level: 'easy',
        weight: 1.20,
        section: 'commerce',
        stream_filter: 'commerce',
        options: [
            {
                text: "MBA (India / Abroad)",
                score_mapping: { science: 0, commerce: 3, technology: 2, arts: 1, design: 1 }
            },
            {
                text: "Professional courses (CA, CMA, CFA)",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 0 }
            },
            {
                text: "Job immediately",
                score_mapping: { science: 0, commerce: 2, technology: 2, arts: 1, design: 2 }
            },
            {
                text: "Family business",
                score_mapping: { science: 0, commerce: 3, technology: 1, arts: 0, design: 1 }
            }
        ]
    },

    // 🔵 SECTION 2D: ARTS / HUMANITIES (Q5-Q8)
    {
        id: 117,
        category: 'college',
        question_text: "Which area attracts you the most?",
        question_type: 'interest',
        difficulty_level: 'medium',
        weight: 1.40,
        section: 'arts',
        stream_filter: 'arts',
        options: [
            {
                text: "Literature & Writing",
                score_mapping: { science: 0, commerce: 0, technology: 0, arts: 3, design: 2 }
            },
            {
                text: "History & Social Sciences",
                score_mapping: { science: 1, commerce: 0, technology: 0, arts: 3, design: 0 }
            },
            {
                text: "Law & Public Policy",
                score_mapping: { science: 1, commerce: 2, technology: 0, arts: 3, design: 0 }
            },
            {
                text: "Media & Communication",
                score_mapping: { science: 0, commerce: 1, technology: 2, arts: 3, design: 3 }
            }
        ]
    },
    {
        id: 118,
        category: 'college',
        question_text: "What type of work do you prefer?",
        question_type: 'work_style',
        difficulty_level: 'medium',
        weight: 1.30,
        section: 'arts',
        stream_filter: 'arts',
        options: [
            {
                text: "Teaching / Academia",
                score_mapping: { science: 2, commerce: 0, technology: 0, arts: 3, design: 1 }
            },
            {
                text: "Writing / Journalism",
                score_mapping: { science: 0, commerce: 0, technology: 1, arts: 3, design: 2 }
            },
            {
                text: "Civil services / Government",
                score_mapping: { science: 1, commerce: 2, technology: 0, arts: 3, design: 0 }
            },
            {
                text: "NGOs / Social work",
                score_mapping: { science: 1, commerce: 0, technology: 0, arts: 3, design: 1 }
            }
        ]
    },
    {
        id: 119,
        category: 'college',
        question_text: "Your strongest skill is?",
        question_type: 'aptitude',
        difficulty_level: 'medium',
        weight: 1.30,
        section: 'arts',
        stream_filter: 'arts',
        options: [
            {
                text: "Communication",
                score_mapping: { science: 0, commerce: 2, technology: 0, arts: 3, design: 2 }
            },
            {
                text: "Research & analysis",
                score_mapping: { science: 3, commerce: 2, technology: 1, arts: 3, design: 0 }
            },
            {
                text: "Critical thinking",
                score_mapping: { science: 2, commerce: 1, technology: 1, arts: 3, design: 1 }
            },
            {
                text: "Creativity",
                score_mapping: { science: 0, commerce: 0, technology: 1, arts: 3, design: 3 }
            }
        ]
    },
    {
        id: 120,
        category: 'college',
        question_text: "Long-term goal?",
        question_type: 'goal',
        difficulty_level: 'easy',
        weight: 1.20,
        section: 'arts',
        stream_filter: 'arts',
        options: [
            {
                text: "Higher studies (MA / PhD)",
                score_mapping: { science: 2, commerce: 0, technology: 0, arts: 3, design: 1 }
            },
            {
                text: "Competitive exams",
                score_mapping: { science: 1, commerce: 2, technology: 0, arts: 3, design: 0 }
            },
            {
                text: "Media / Publishing",
                score_mapping: { science: 0, commerce: 1, technology: 2, arts: 3, design: 3 }
            },
            {
                text: "Social sector",
                score_mapping: { science: 1, commerce: 0, technology: 0, arts: 3, design: 1 }
            }
        ]
    },

    // 🟣 SECTION 2E: DESIGN / CREATIVE (Q5-Q8)
    {
        id: 121,
        category: 'college',
        question_text: "Which field excites you most?",
        question_type: 'interest',
        difficulty_level: 'medium',
        weight: 1.40,
        section: 'design',
        stream_filter: 'design',
        options: [
            {
                text: "Graphic / Visual Design",
                score_mapping: { science: 0, commerce: 0, technology: 2, arts: 1, design: 3 }
            },
            {
                text: "UI/UX / Product Design",
                score_mapping: { science: 0, commerce: 1, technology: 3, arts: 0, design: 3 }
            },
            {
                text: "Fashion / Interior Design",
                score_mapping: { science: 0, commerce: 2, technology: 0, arts: 2, design: 3 }
            },
            {
                text: "Animation / Media",
                score_mapping: { science: 0, commerce: 0, technology: 2, arts: 2, design: 3 }
            }
        ]
    },
    {
        id: 122,
        category: 'college',
        question_text: "What do you enjoy more?",
        question_type: 'aptitude',
        difficulty_level: 'medium',
        weight: 1.30,
        section: 'design',
        stream_filter: 'design',
        options: [
            {
                text: "Creative ideation",
                score_mapping: { science: 0, commerce: 0, technology: 1, arts: 3, design: 3 }
            },
            {
                text: "User experience & problem-solving",
                score_mapping: { science: 1, commerce: 1, technology: 3, arts: 1, design: 3 }
            },
            {
                text: "Aesthetic styling",
                score_mapping: { science: 0, commerce: 1, technology: 0, arts: 2, design: 3 }
            },
            {
                text: "Digital tools & software",
                score_mapping: { science: 1, commerce: 0, technology: 3, arts: 0, design: 3 }
            }
        ]
    },
    {
        id: 123,
        category: 'college',
        question_text: "Preferred career path?",
        question_type: 'work_style',
        difficulty_level: 'medium',
        weight: 1.30,
        section: 'design',
        stream_filter: 'design',
        options: [
            {
                text: "Designer in a company",
                score_mapping: { science: 0, commerce: 2, technology: 2, arts: 1, design: 3 }
            },
            {
                text: "Freelancer",
                score_mapping: { science: 0, commerce: 2, technology: 2, arts: 2, design: 3 }
            },
            {
                text: "Startup founder",
                score_mapping: { science: 0, commerce: 3, technology: 3, arts: 1, design: 3 }
            },
            {
                text: "Creative director",
                score_mapping: { science: 0, commerce: 2, technology: 1, arts: 3, design: 3 }
            }
        ]
    },
    {
        id: 124,
        category: 'college',
        question_text: "Higher studies interest?",
        question_type: 'goal',
        difficulty_level: 'easy',
        weight: 1.20,
        section: 'design',
        stream_filter: 'design',
        options: [
            {
                text: "Master's in Design",
                score_mapping: { science: 0, commerce: 0, technology: 2, arts: 2, design: 3 }
            },
            {
                text: "Certification courses",
                score_mapping: { science: 0, commerce: 1, technology: 2, arts: 1, design: 3 }
            },
            {
                text: "Job immediately",
                score_mapping: { science: 0, commerce: 2, technology: 2, arts: 1, design: 2 }
            },
            {
                text: "International exposure",
                score_mapping: { science: 0, commerce: 1, technology: 2, arts: 2, design: 3 }
            }
        ]
    },

    // 🟤 SECTION 3: FIELD SWITCH - COMMON FOR ALL (Q9-Q10)
    {
        id: 125,
        category: 'college',
        question_text: "Are you open to switching your field?",
        question_type: 'personality',
        difficulty_level: 'easy',
        weight: 1.10,
        section: 'common',
        options: [
            {
                text: "Yes, completely",
                score_mapping: { science: 1, commerce: 1, technology: 1, arts: 1, design: 1 }
            },
            {
                text: "Yes, related field",
                score_mapping: { science: 2, commerce: 2, technology: 2, arts: 2, design: 2 }
            },
            {
                text: "Not sure",
                score_mapping: { science: 1, commerce: 1, technology: 1, arts: 1, design: 1 }
            },
            {
                text: "No",
                score_mapping: { science: 3, commerce: 3, technology: 3, arts: 3, design: 3 }
            }
        ]
    },
    {
        id: 126,
        category: 'college',
        question_text: "What is your reason for switching (if any)?",
        question_type: 'personality',
        difficulty_level: 'medium',
        weight: 1.00,
        section: 'common',
        options: [
            {
                text: "Lack of interest",
                score_mapping: { science: 1, commerce: 1, technology: 1, arts: 2, design: 2 }
            },
            {
                text: "Better career opportunities",
                score_mapping: { science: 1, commerce: 3, technology: 3, arts: 1, design: 2 }
            },
            {
                text: "Salary concerns",
                score_mapping: { science: 0, commerce: 3, technology: 3, arts: 0, design: 1 }
            },
            {
                text: "Work-life balance",
                score_mapping: { science: 2, commerce: 2, technology: 2, arts: 3, design: 2 }
            }
        ]
    }
];

export const professionalQuestions = [];

/**
 * Export all questions combined
 */
export const allCareerQuestions = [
    ...schoolQuestions,
    ...collegeQuestions,
    ...professionalQuestions
];

/**
 * Get questions by category
 */
export function getQuestionsByCategory(category) {
    return allCareerQuestions.filter(q => q.category === category);
}

/**
 * Validate question structure
 */
export function validateQuestion(question) {
    const requiredFields = ['id', 'category', 'question_text', 'question_type', 'difficulty_level', 'weight', 'options'];
    const hasAllFields = requiredFields.every(field => question.hasOwnProperty(field));
    const has4Options = question.options && question.options.length === 4;
    const allOptionsHaveScores = question.options.every(opt =>
        opt.text && opt.score_mapping &&
        Object.keys(opt.score_mapping).length === 5
    );

    return hasAllFields && has4Options && allOptionsHaveScores;
}
