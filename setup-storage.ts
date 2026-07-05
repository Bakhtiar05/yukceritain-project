import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  console.log("Checking if 'counselors' bucket exists...");
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error("Error listing buckets:", listError);
    process.exit(1);
  }

  const bucketExists = buckets.some(b => b.name === 'counselors');

  if (!bucketExists) {
    console.log("Creating 'counselors' bucket...");
    const { data, error } = await supabase.storage.createBucket('counselors', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      console.error("Error creating bucket:", error);
      process.exit(1);
    }
    console.log("Bucket created successfully:", data);
  } else {
    console.log("'counselors' bucket already exists.");
  }
}

setupStorage();
