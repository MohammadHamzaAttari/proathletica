const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Manually parse .env file to load credentials
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env file not found in project root!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env!');
  process.exit(1);
}

console.log(`🌐 Connecting to Supabase at: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, serviceKey);

// 2. Define premium products to seed (OMITTING specs column which is not in db)
const PREMIUM_PRODUCTS = [
  {
    id: 'rogue-adjustable-bench-3',
    asin: 'ROGUE-BENCH-3',
    slug: 'rogue-adjustable-bench-3',
    category: 'Home Gym',
    subcategory: 'Weight Bench',
    brand: 'Rogue Fitness',
    title: 'Rogue Adjustable Bench 3.0 (Commercial Grade)',
    raw_description: 'The gold standard in home strength training. Featuring a heavy-duty 3x3-inch 11-gauge steel frame, 6 adjustment positions from flat to 78 degrees, and dual-density premium vinyl pads with zero gap. Built entirely in the USA.',
    description: 'The gold standard in home strength training. Featuring a heavy-duty 3x3-inch 11-gauge steel frame, 6 adjustment positions from flat to 78 degrees, and dual-density premium vinyl pads with zero gap. Built entirely in the USA.',
    short_title: 'Rogue Adjustable Bench 3.0',
    editorial_summary: 'Best professional-grade upgrade for heavy powerlifting, featuring virtually indestructible 11-gauge US steel and a pristine zero-gap pad layout.',
    pros: ['Indestructible 11-gauge structural steel frame', 'Pristine dual-density zero-gap vinyl pad', 'Adjusts from flat to 78 degrees in seconds', 'Integrated wheels and vertical storage stands'],
    cons: ['Very heavy at 125 lbs, making mobility harder', 'Premium price tag compared with budget imports'],
    best_for_tags: ['Heavy lifting', 'Powerlifting', 'Professional grade'],
    keyword: 'adjustable bench premium rogue',
    price_cents: 59500, // $595.00
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=800',
    affiliate_url: 'https://roguefitness.com/rogue-adjustable-bench-3?aff=proathletica',
    rating: 4.9,
    review_count: 3200,
    badge: 'Professional Grade',
    rank: 999,
    is_featured: false
  },
  {
    id: 'rogue-monster-bands',
    asin: 'ROGUE-MONSTER-BANDS',
    slug: 'rogue-monster-bands',
    category: 'Resistance Training',
    subcategory: 'Bands',
    brand: 'Rogue Fitness',
    title: 'Rogue Monster Latex Pull-Up & Strength Bands',
    raw_description: 'Premium natural latex resistance loop bands designed for heavy powerlifting, pull-up assistance, mobility, and dynamic rehabilitation. Engineered to resist tearing and snapped tension.',
    description: 'Premium natural latex resistance loop bands designed for heavy powerlifting, pull-up assistance, mobility, and dynamic rehabilitation. Engineered to resist tearing and snapped tension.',
    short_title: 'Rogue Monster Bands',
    editorial_summary: 'Best professional strength latex bands, virtually snap-proof and crafted from multi-layered natural latex for progressive, reliable tension.',
    pros: ['Multi-layered natural latex avoids tearing', 'Highly consistent progressive tension curve', 'Available in resistance packages up to 200 lbs'],
    cons: ['Smells slightly of raw rubber initially', 'Slightly higher cost than basic multi-packs'],
    best_for_tags: ['Pull-up assistance', 'Warmups', 'Strength work'],
    keyword: 'resistance loop bands rogue monster',
    price_cents: 4500, // $45.00
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    affiliate_url: 'https://roguefitness.com/rogue-monster-bands?aff=proathletica',
    rating: 4.8,
    review_count: 14500,
    badge: 'Pro Strength',
    rank: 999,
    is_featured: false
  },
  {
    id: 'wahoo-kickr-run-treadmill',
    asin: 'WAHOO-KICKR-RUN',
    slug: 'wahoo-kickr-run-treadmill',
    category: 'Cardio Machines',
    subcategory: 'Treadmills',
    brand: 'Wahoo Fitness',
    title: 'Wahoo KICKR RUN Smart Incline Treadmill',
    raw_description: 'The ultimate indoor running experience. Featuring Wahoo’s RunFree system which uses high-speed sensors to match your natural stride velocity automatically—no buttons required. Includes up to 15% incline, lateral tilt simulation, and direct Zwift app integration.',
    description: 'The ultimate indoor running experience. Featuring Wahoo’s RunFree system which uses high-speed sensors to match your natural stride velocity automatically—no buttons required. Includes up to 15% incline, lateral tilt simulation, and direct Zwift app integration.',
    short_title: 'Wahoo KICKR RUN',
    editorial_summary: 'Premium professional-grade smart treadmill featuring revolutionary RunFree sensor stride control and lateral tilt simulation for realistic road feel.',
    pros: ['RunFree automatic stride speed control', 'Lateral tilt simulation mimics real road camber', 'Direct Zwift, Wahoo, and Apple Health sync', 'Elite-tier shock absorption deck'],
    cons: ['Premium price bracket', 'Requires professional shipping and initial home installation'],
    best_for_tags: ['Marathon training', 'Smart running', 'Connected fitness'],
    keyword: 'smart incline treadmill wahoo kickr',
    price_cents: 399900, // $3,999.00
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800',
    affiliate_url: 'https://wahoofitness.com/kickr-run?aff=proathletica',
    rating: 4.9,
    review_count: 320,
    badge: 'Best Luxury Smart',
    rank: 999,
    is_featured: false
  },
  {
    id: 'gnc-energy-recovery-stack',
    asin: 'GNC-ENERGY-STACK',
    slug: 'gnc-energy-recovery-stack',
    category: 'Sports Nutrition',
    subcategory: 'Supplements',
    brand: 'GNC Professional',
    title: 'GNC AMP Active Energy & Recovery Stack',
    raw_description: 'A scientifically compiled stack designed to optimize pre-workout focus and post-workout muscle protein synthesis. Includes AMP Whey Isolate (25g protein), high-bioavailability Magnesium Glycinate, and pure Micronized Creatine.',
    description: 'A scientifically compiled stack designed to optimize pre-workout focus and post-workout muscle protein synthesis. Includes AMP Whey Isolate (25g protein), high-bioavailability Magnesium Glycinate, and pure Micronized Creatine.',
    short_title: 'GNC Active Energy Stack',
    editorial_summary: 'Elite muscle protein synthesis and recovery stack, combining ultra-pure whey isolate, cognitive focus agents, and muscle-relaxing magnesium.',
    pros: ['Premium grass-fed cold-processed whey isolate', 'Magnesium glycinate prevents nocturnal muscle cramps', '100% pure micronized creatine monohydrate included'],
    cons: ['Whey protein is not suitable for vegan lifestyles'],
    best_for_tags: ['Muscle recovery', 'Energy focus', 'Muscle growth'],
    keyword: 'sports nutrition recovery supplement stack',
    price_cents: 8500, // $85.00
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800',
    affiliate_url: 'https://gnc.com/amp-energy-stack?aff=proathletica',
    rating: 4.7,
    review_count: 5120,
    badge: 'Editorial Choice',
    rank: 999,
    is_featured: false
  },
  {
    id: 'clickbank-12wk-strength-program',
    asin: 'CLICKBANK-STRENGTH-12WK',
    slug: 'clickbank-12wk-strength-program',
    category: 'Sports Nutrition',
    subcategory: 'Digital Courses',
    brand: 'ClickBank Academy',
    title: 'Athletica Pro 12-Week Progressive Strength System',
    raw_description: 'An elite digital programming application designed by CSCS coaches to fast-track hypertrophy, core stability, and compound lift numbers. Includes step-by-step video tutorials, progressive overload tracking, and nutrition guides.',
    description: 'An elite digital programming application designed by CSCS coaches to fast-track hypertrophy, core stability, and compound lift numbers. Includes step-by-step video tutorials, progressive overload tracking, and nutrition guides.',
    short_title: '12-Week Progressive Strength',
    editorial_summary: 'Comprehensive 12-week CSCS strength program and digital tracker, optimized for home gym setups and progressive overload mapping.',
    pros: ['Step-by-step video guides for all compound lifts', 'Dynamic progressive overload logs and calculators', 'Customizable nutrition plans matching metabolic baselines'],
    cons: ['Requires strict weekly adherence to see progressive results'],
    best_for_tags: ['Hypertrophy training', 'Digital guide', 'Home gym programming'],
    keyword: 'digital program strength course home gym',
    price_cents: 3700, // $37.00
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    affiliate_url: 'https://clickbank.net/athletica-strength-12wk?aff=proathletica',
    rating: 4.8,
    review_count: 1240,
    badge: '100% Digital',
    rank: 999,
    is_featured: false
  }
];

async function seed() {
  console.log(`🚀 Seeding ${PREMIUM_PRODUCTS.length} premium products (specs column omitted)...`);
  
  for (const product of PREMIUM_PRODUCTS) {
    const { data, error } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'id' });
      
    if (error) {
      console.error(`❌ Failed to seed product "${product.id}":`, error.message);
    } else {
      console.log(`✅ Seeded product "${product.id}" successfully.`);
    }
  }
  
  console.log('\n🌟 Seeding complete!');
  process.exit(0);
}

seed();
