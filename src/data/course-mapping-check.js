// ALL COURSES USED IN CAREER PATHS - MANUAL EXTRACTION
// Format: "Course Name" → Database Key that should exist

export const COURSE_MAPPING_CHECK = {
    // Science stream - Medical path
    "MBBS": "MBBS",  // ✓ Should exist
    "MD/MS": "MD",  // ✓ Should parse to MD

    // Science stream - Engineering path  
    "B.Tech/B.E.": "B.Tech",  // ✓ Should parse to B.Tech
    "M.Tech/MBA": "M.Tech",  // ? Need M.Tech in database

    // Science stream - Research path
    "B.Sc.": "B.Sc",  // ✓ Should exist
    "M.Sc.": "M.Sc",  // ✓ Should exist
    "Ph.D.": "Ph.D",  // ✓ Should exist

    // Commerce stream - CA path
    "B.Com + CA Foundation": "B.Com",  // ? Need B.Com in database
    "CA Intermediate": "CA",  // ✓ Should parse to CA
    "CA Final + Articleship": "CA",  // ✓ Should parse to CA

    // Commerce stream - MBA path
    "B.Com/BBA/Any Degree": "B.Com",  // ? Need B.Com in database
    "MBA": "MBA",  // ✓ Should exist

    // Commerce stream - Banking path
    "B.Com/BBA Finance": "B.Com",  // ? Need B.Com in database
    "CFA/FRM": "CFA",  // ✓ Should parse to CFA

    // Technology stream - Software path
    "B.Tech CSE/IT": "B.Tech",  // ✓ Should parse to B.Tech

    // Technology stream - Data Science path
    "B.Tech/B.Sc. Data Science": "B.Tech",  // ✓ Should parse to B.Tech
    "M.Sc. Data Science": "M.Sc",  // ✓ Should parse to M.Sc

    // Technology stream - Cybersecurity path
    "B.Tech Cybersecurity": "B.Tech",  // ✓ Should parse to B.Tech

    // Arts stream - Journalism path
    "BA Journalism/Mass Comm": "BA",  // ✓ Should parse to BA
    "MA Journalism": "MA",  // ✓ Should parse to MA

    // Arts stream - Civil Services path
    "BA/Any Degree": "BA",  // ✓ Should parse to BA

    // Arts stream - Creative Arts path
    "BFA/BA Fine Arts": "BFA",  // ✓ Should parse to BFA
    "MFA": "MFA",  // ✓ Should exist

    // Design stream - UX/UI path  
    "B.Des/BFA": "B.Des",  // ✓ Should parse to B.Des

    // Design stream - Fashion path
    "B.Des Fashion": "B.Des",  // ✓ Should parse to B.Des
    "M.Des Fashion": "M.Des",  // ✓ Should parse to M.Des

    // Design stream - Interior path
    "B.Des Interior": "B.Des",  // ✓ Should parse to B.Des
};

// MISSING FROM DATABASE:
// 1. M.Tech
// 2. B.Com (appears multiple times!)
