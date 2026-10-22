const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx !== -1) {
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanAndDeduplicate() {
  console.log('--- Cleaning up duplicated tables in Supabase ---');

  // 1. Process Steps: keep only 6 unique steps
  const { data: rawSteps } = await supabase.from('home_process_steps').select('*').order('sort_order');
  if (rawSteps && rawSteps.length > 6) {
    const seen = new Set();
    const toKeep = [];
    const toDelete = [];
    for (const step of rawSteps) {
      const key = `${step.number}-${step.title}`;
      if (!seen.has(key)) {
        seen.add(key);
        toKeep.push(step.id);
      } else {
        toDelete.push(step.id);
      }
    }
    if (toDelete.length > 0) {
      console.log(`Deleting ${toDelete.length} duplicate process steps...`);
      await supabase.from('home_process_steps').delete().in('id', toDelete);
    }
  }

  // 2. Clients: keep only 11 unique clients
  const { data: rawClients } = await supabase.from('cms_clients').select('*').order('sort_order');
  if (rawClients && rawClients.length > 11) {
    const seen = new Set();
    const toKeep = [];
    const toDelete = [];
    for (const client of rawClients) {
      const key = client.name.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        toKeep.push(client.id);
      } else {
        toDelete.push(client.id);
      }
    }
    if (toDelete.length > 0) {
      console.log(`Deleting ${toDelete.length} duplicate clients...`);
      await supabase.from('cms_clients').delete().in('id', toDelete);
    }
  }

  // 3. Home Stats: keep only 4 unique stats
  const { data: rawStats } = await supabase.from('home_stats').select('*').order('sort_order');
  if (rawStats && rawStats.length > 4) {
    const seen = new Set();
    const toDelete = [];
    for (const stat of rawStats) {
      const key = stat.label.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
      } else {
        toDelete.push(stat.id);
      }
    }
    if (toDelete.length > 0) {
      console.log(`Deleting ${toDelete.length} duplicate home stats...`);
      await supabase.from('home_stats').delete().in('id', toDelete);
    }
  }

  // 4. Pan India Stats: keep only 3 unique stats
  const { data: rawPan } = await supabase.from('pan_india_stats').select('*').order('sort_order');
  if (rawPan && rawPan.length > 3) {
    const seen = new Set();
    const toDelete = [];
    for (const stat of rawPan) {
      const key = stat.label.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
      } else {
        toDelete.push(stat.id);
      }
    }
    if (toDelete.length > 0) {
      console.log(`Deleting ${toDelete.length} duplicate pan-india stats...`);
      await supabase.from('pan_india_stats').delete().in('id', toDelete);
    }
  }

  // 5. Testimonials: Delete all duplicates and insert 5 rich, distinct testimonials
  console.log('Resetting and seeding 5 fresh, distinct testimonials...');
  await supabase.from('cms_testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const DISTINCT_TESTIMONIALS = [
    {
      quote: "ACE SELECT delivered exceptional turnkey ATM kiosk fabrication and signage deployment across hundreds of locations nationwide on schedule.",
      author_name: "Rohit Sharma",
      author_title: "Head - ATM Deployments & Infrastructure",
      author_company: "HITACHI PAYMENT SERVICES",
      is_featured: true,
      sort_order: 1,
      is_active: true
    },
    {
      quote: "Their end-to-end support from optical design to retail installation made our flagship in-store Active LED display rollouts smooth, stunning, and flawless.",
      author_name: "Neha Verma",
      author_title: "VP - Retail Experience & Projects",
      author_company: "TITAN COMPANY / CARATLANE",
      is_featured: true,
      sort_order: 2,
      is_active: true
    },
    {
      quote: "Reliable, innovative and committed. ACE SELECT has been our trusted partner for nationwide banking branch rebranding and display infrastructure for over a decade.",
      author_name: "Amit Khanna",
      author_title: "Chief Manager - Infrastructure & Branding",
      author_company: "STATE BANK OF INDIA",
      is_featured: true,
      sort_order: 3,
      is_active: true
    },
    {
      quote: "The architectural display installations and facade branding by ACE SELECT exceeded our expectations in build quality, structural safety, and visual impact.",
      author_name: "Priya Sundaram",
      author_title: "Director - Commercial Real Estate & Workspace Design",
      author_company: "DLF CYBERCITY",
      is_featured: true,
      sort_order: 4,
      is_active: true
    },
    {
      quote: "Rapid nationwide rollout across Tier 2 and Tier 3 branches without a single hitch. Their logistical capability and fabrication consistency across India is unmatched.",
      author_name: "Vikramaditya Rao",
      author_title: "Head of Operations & Network Expansion",
      author_company: "MUTHOOT FINANCE GROUP",
      is_featured: true,
      sort_order: 5,
      is_active: true
    }
  ];

  const { data: inserted, error: insertErr } = await supabase.from('cms_testimonials').insert(DISTINCT_TESTIMONIALS).select();
  if (insertErr) {
    console.error('Error inserting testimonials:', insertErr);
  } else {
    console.log(`Successfully seeded ${inserted.length} distinct testimonials!`);
  }

  // Update local cache file as well
  const cachePath = 'src/data/cms-content-cache.json';
  if (fs.existsSync(cachePath)) {
    try {
      const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      cache.testimonials = inserted || DISTINCT_TESTIMONIALS;
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
      console.log('Successfully updated cms-content-cache.json with testimonials');
    } catch (err) {
      console.error('Error updating cache file:', err);
    }
  }

  console.log('--- Cleanup & Deduplication Complete ---');
}

cleanAndDeduplicate();
