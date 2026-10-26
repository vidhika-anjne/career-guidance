import { ensureDatabase, getPool } from '../db/pool.js';

const CITY_COORDS = {
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777],
  'chennai': [13.0827, 80.2707],
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'kolkata': [22.5726, 88.3639],
  'hyderabad': [17.3850, 78.4867],
  'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714],
  'lucknow': [26.8467, 80.9462],
  'chandigarh': [30.7333, 76.7794],
  'coimbatore': [11.0168, 76.9558],
  'bhubaneswar': [20.2961, 85.8245],
  'varanasi': [25.3176, 82.9739],
  'tiruchirappalli': [10.7905, 78.7047],
  'jaipur': [26.9124, 75.7873],
  'indore': [22.7196, 75.8577],
  'bhopal': [23.2599, 77.4126],
  'kanpur': [26.4499, 80.3319],
  'nagpur': [21.1458, 79.0882],
  'patna': [25.5941, 85.1376],
  'thiruvananthapuram': [8.5241, 76.9366],
  'kochi': [9.9312, 76.2673],
  'kozhikode': [11.2588, 75.7804],
  'guwahati': [26.1445, 91.7362],
  'dehradun': [30.3165, 78.0322],
  'roorkee': [29.8543, 77.8880],
  'kharagpur': [22.3460, 87.2320],
  'pilani': [28.3639, 75.5875],
  'vellore': [12.9165, 79.1325],
  'manipal': [13.3409, 74.7421],
  'surathkal': [13.0108, 74.7943],
  'rourkela': [22.2604, 84.8536],
  'warangal': [17.9689, 79.5941],
  'visakhapatnam': [17.6868, 83.2185],
  'mysore': [12.2958, 76.6394],
  'vadodara': [22.3072, 73.1812],
  'surat': [21.1702, 72.8311]
};

async function seedCoords() {
  await ensureDatabase();
  const pool = getPool();

  console.log('Populating paths JSON field...');
  await pool.query('UPDATE colleges SET paths = JSON_ARRAY(type) WHERE paths IS NULL OR paths = "[]"');

  const [colleges] = await pool.query('SELECT id, city, state FROM colleges');
  let updated = 0;

  for (const c of colleges) {
    const cityKey = (c.city || '').trim().toLowerCase();
    const stateKey = (c.state || '').trim().toLowerCase();

    let coords = CITY_COORDS[cityKey] || (cityKey.includes('delhi') ? CITY_COORDS['delhi'] : null) || (stateKey.includes('delhi') ? CITY_COORDS['delhi'] : null);

    if (coords) {
      // Add slight jitter (within ~5km)
      const latJitter = (Math.random() - 0.5) * 0.08;
      const lngJitter = (Math.random() - 0.5) * 0.08;
      const lat = (coords[0] + latJitter).toFixed(7);
      const lng = (coords[1] + lngJitter).toFixed(7);

      await pool.query('UPDATE colleges SET latitude = ?, longitude = ? WHERE id = ?', [lat, lng, c.id]);
      updated++;
    }
  }

  console.log(`Updated coordinates for ${updated} / ${colleges.length} colleges.`);
  process.exit(0);
}

seedCoords().catch((e) => {
  console.error(e);
  process.exit(1);
});
