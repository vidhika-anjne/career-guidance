/**
 * OTP Debug Tool
 * Run this to see what's in the database and test OTP verification
 */

import { getPool } from '../db/pool.js';
import bcrypt from 'bcrypt';

async function debugOTP() {
    try {
        const pool = getPool();

        console.log('🔍 OTP Debug Tool\n');

        // Show all login OTPs
        const [otps] = await pool.query(`
      SELECT 
        email,
        purpose,
        expires_at,
        used,
        created_at,
        TIMESTAMPDIFF(MINUTE, NOW(), expires_at) as minutes_until_expiry
      FROM email_otps 
      WHERE purpose = 'login'
      ORDER BY created_at DESC
      LIMIT 5
    `);

        console.log('📧 Recent Login OTPs:');
        console.table(otps);

        if (otps.length > 0) {
            const latest = otps[0];
            console.log(`\n✅ Latest OTP for: ${latest.email}`);
            console.log(`   Used: ${latest.used ? 'YES' : 'NO'}`);
            console.log(`   Expires in: ${latest.minutes_until_expiry} minutes`);
            console.log(`   Created: ${latest.created_at}`);

            // Prompt for manual test
            console.log('\n💡 To test OTP manually:');
            console.log('   1. Check server console for: [LOGIN] Generated OTP - Code: XXXXXX');
            console.log('   2. Enter that code in the login form');
            console.log('   3. Make sure it matches exactly (6 digits)');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Wait for pool initialization
setTimeout(debugOTP, 1000);
