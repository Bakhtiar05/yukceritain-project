require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const words = [
  'anjing', 'babi', 'bangsat', 'bgst', 'bgsat', 'kontol', 'memek', 'ngentot',
  'pantek', 'peler', 'tolol', 'goblok', 'fuck', 'shit', 'bitch', 'anjg', 'njing', 
  'anjir', 'anjay', 'asu', 'bajingan', 'kampret', 'kunyuk', 'tai', 'taik', 'lonte', 
  'jablay', 'pelacur', 'pecun', 'perek', 'bencong', 'banci', 'maho', 'gay', 'lesbi', 
  'homo', 'jembut', 'tetek', 'toket', 'sinting', 'sarap', 'gila', 'edan', 'keparat',
  'bedebah', 'sialan', 'brengsek', 'cuki', 'cukimai', 'puki', 'pukimak', 'kimak',
  'itil', 'turuk', 'tempik', 'ngewe', 'ewe', 'entot', 'sange', 'bokep', 'porno',
  'bugil', 'telanjang', 'ngaceng', 'colmek', 'coli', 'masturbasi', 'peju', 'sperma',
  'lonth3', 'jabl4y', 'p3c4n', '4nj1ng', 'b4b1', 'b4ngs4t', 'k0nt0l', 'm3m3k', 
  'ng3nt0t', 'p4nt3k', 'p3l3r', 't0l0l', 'g0bl0k', 'f4ck', 'sh1t', 'b1tch',
  'kntl', 'mmk', 'ppk', 'pler', 'peler', 'anj', 'ajg', 'asshole', 'motherfucker',
  'dick', 'pussy', 'cock', 'cunt', 'whore', 'slut', 'bastard', 'kambing'
];

// Remove duplicates and trim
const uniqueWords = [...new Set(words.map(w => w.trim().toLowerCase()))];

async function seed() {
  console.log(`Preparing to insert ${uniqueWords.length} words...`);
  
  const inserts = uniqueWords.map(w => ({ word: w }));
  
  let successCount = 0;
  for (const item of inserts) {
    const { error } = await supabase.from('community_profanity').insert(item);
    if (!error) {
      successCount++;
    } else if (error.code !== '23505') { // 23505 is unique violation
       console.error(`Error inserting ${item.word}:`, error.message);
    }
  }

  console.log(`Successfully added ${successCount} new words to the database!`);
}

seed();
