// Script to check all course names from career paths
import { careerPathMappings } from './careerPathMapping.js';
import { courseDatabase } from './courseDatabase.js';

// Extract all unique course names from career paths
const allCourses = new Set();

Object.values(careerPathMappings).forEach(stream => {
    stream.paths.forEach(path => {
        path.stages.forEach(stage => {
            // Skip non-degree stages like 12th, Skills, Career, Preparation, Certification
            if (!['12th', 'Skills', 'Career', 'Preparation', 'Certification'].includes(stage.level)) {
                allCourses.add(stage.course);
            }
        });
    });
});

console.log('=== ALL COURSE NAMES FROM CAREER PATHS ===');
const sortedCourses = Array.from(allCourses).sort();
sortedCourses.forEach(course => console.log(`- ${course}`));

console.log('\n=== CHECKING DATABASE COVERAGE ===');
sortedCourses.forEach(courseName => {
    // Try direct match
    let found = courseDatabase[courseName];

    // Try smart parsing
    if (!found && courseName.includes('/')) {
        const firstPart = courseName.split('/')[0].trim();
        found = courseDatabase[firstPart];
        if (found) {
            console.log(`✓ ${courseName} → Found via "${firstPart}"`);
        }
    } else if (!found && courseName.includes('(')) {
        const baseName = courseName.split('(')[0].trim();
        found = courseDatabase[baseName];
        if (found) {
            console.log(`✓ ${courseName} → Found via "${baseName}"`);
        }
    } else if (!found && courseName.includes(' ')) {
        const firstWord = courseName.split(' ')[0].trim();
        found = courseDatabase[firstWord];
        if (found) {
            console.log(`✓ ${courseName} → Found via "${firstWord}"`);
        }
    } else if (!found && courseName.includes('+')) {
        const firstPart = courseName.split('+')[0].trim();
        found = courseDatabase[firstPart];
        if (found) {
            console.log(`✓ ${courseName} → Found via "${firstPart}"`);
        }
    } else if (found) {
        console.log(`✓ ${courseName} → Found directly`);
    }

    if (!found) {
        console.log(`✗ ${courseName} → MISSING!`);
    }
});

console.log('\n=== COURSES IN DATABASE ===');
Object.keys(courseDatabase).sort().forEach(key => {
    console.log(`- ${key}`);
});
