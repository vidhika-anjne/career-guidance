const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/colleges?limit=1',
    method: 'GET'
};

console.log('🌐 Testing API endpoint...\n');

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);

            if (json.items && json.items.length > 0) {
                const college = json.items[0];

                console.log('✅ API Response received\n');
                console.log(`College: ${college.name}`);
                console.log(`\nChecking metrics fields:`);
                console.log(`  institute_id: ${college.institute_id || 'MISSING'}`);
                console.log(`  tlr: ${college.tlr || 'MISSING'}`);
                console.log(`  rpc: ${college.rpc || 'MISSING'}`);
                console.log(`  go_score: ${college.go_score || 'MISSING'}`);
                console.log(`  oi: ${college.oi || 'MISSING'}`);
                console.log(`  perception: ${college.perception || 'MISSING'}`);
                console.log(`  total_score: ${college.total_score || 'MISSING'}`);
                console.log(`  rank_position: ${college.rank_position || 'MISSING'}`);
            } else {
                console.log('❌ No items in response');
            }
        } catch (err) {
            console.error('❌ Error parsing JSON:', err.message);
        }
    });
});

req.on('error', (err) => {
    console.error('❌ Request error:', err.message);
});

req.end();
