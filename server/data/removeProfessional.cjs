const mysql = require('mysql2/promise');

async function removeProfessionalCategory() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'ansh',
        database: 'ansh'
    });

    console.log('🗑️  Removing Working Professional category...\n');

    // Check if any questions exist
    const [check] = await conn.query("SELECT COUNT(*) as cnt FROM career_questions WHERE category = 'professional'");
    console.log(`Found ${check[0].cnt} professional category questions`);

    if (check[0].cnt > 0) {
        // Delete them
        const [result] = await conn.query("DELETE FROM career_questions WHERE category = 'professional'");
        console.log(`✅ Deleted ${result.affectedRows} questions\n`);
    } else {
        console.log('✅ No professional questions found\n');
    }

    // Check remaining categories
    const [categories] = await conn.query("SELECT DISTINCT category, COUNT(*) as cnt FROM career_questions GROUP BY category");
    console.log('📊 Remaining categories:');
    categories.forEach(c => console.log(`   ${c.category}: ${c.cnt} questions`));

    await conn.end();
}

removeProfessionalCategory();
