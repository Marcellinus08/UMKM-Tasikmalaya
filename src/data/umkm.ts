export const UMKMS = [
  {
    name: "Warung Nasi Ibu Ani",
    category: "Kuliner",
    description: "Warung nasi dengan menu khas Sunda yang lezat dan harga terjangkau",
    address: "Jl. Sutisna Senjaya No. 45, Tawang, Tasikmalaya",
    phone: "0812-3456-7890",
    lat: -7.3287, 
    lng: 108.2145,
  },
  {
    name: "Batik Tasik Kreasi",
    category: "Fashion & Pakaian",
    description: "Produsen dan penjual batik khas Tasikmalaya dengan motif tradisional",
    address: "Jl. Ciamis No. 12, Cihideung, Tasikmalaya",
    phone: "0813-4567-8901",
    lat: -7.3301, 
    lng: 108.2210,
  },
  {
    name: "Anyaman Bambu Karya Mandiri",
    category: "Kerajinan Tangan",
    description: "Kerajinan anyaman bambu berkualitas tinggi untuk keperluan rumah tangga",
    address: "Jl. Pahlawan No. 78, Cipedes, Tasikmalaya",
    phone: "0822-5678-9012",
    lat: -7.3245, 
    lng: 108.2282,
  },
  {
    name: "Salon Cantik Berseri",
    category: "Kesehatan & Kecantikan",
    description: "Salon kecantikan dengan layanan lengkap dan harga ramah kantong",
    address: "Jl. Yudanegara No. 34, Cihideung, Tasikmalaya",
    phone: "0821-6789-0123",
    lat: -7.3335, 
    lng: 108.2235,
  },
  {
    name: "Toko Elektronik Maju Jaya",
    category: "Elektronik",
    description: "Menjual berbagai peralatan elektronik dan aksesoris dengan garansi resmi",
    address: "Jl. Sutisna Senjaya No. 120, Tawang, Tasikmalaya",
    phone: "0823-7890-1234",
    lat: -7.3198, 
    lng: 108.2175,
  },
  {
    name: "Laundry Express Clean",
    category: "Jasa",
    description: "Jasa laundry kiloan dan satuan dengan layanan cepat dan bersih",
    address: "Jl. Ir. H. Juanda No. 56, Mangkubumi, Tasikmalaya",
    phone: "0812-8901-2345",
    lat: -7.3260, 
    lng: 108.2260,
  },
  {
    name: "Roti & Kue Manis Jaya",
    category: "Kuliner",
    description: "Toko roti dan kue rumahan segar setiap hari",
    address: "Jl. RE Martadinata No. 9, Cipedes, Tasikmalaya",
    phone: "0812-1111-2222",
    lat: -7.3315, 
    lng: 108.2168,
  },
  {
    name: "Apotek Sehat Farma",
    category: "Kesehatan & Kecantikan",
    description: "Apotek dan kebutuhan kesehatan keluarga",
    address: "Jl. HZ Mustofa No. 88, Mangkubumi, Tasikmalaya",
    phone: "0813-2222-3333",
    lat: -7.3222, 
    lng: 108.2198,
  },
];

export const CAT_COLOR: Record<string, string> = {
  // Kategori Kuliner - Orange & Red tones
  "Kuliner": "#FF6B35",           // Vibrant Orange
  "kuliner": "#FF6B35",           // lowercase
  "Restoran": "#E63946",          // Red
  "restoran": "#E63946",          // lowercase
  "Warung nasi": "#F77F00",       // Princeton Orange
  "warung nasi": "#F77F00",       // lowercase
  "Warung Nasi": "#F77F00",       // capitalized
  "Kedai Kopi": "#8B4513",        // Saddle Brown
  "kedai kopi": "#8B4513",        // lowercase
  "Kafe": "#A0522D",              // Sienna Brown
  "kafe": "#A0522D",              // lowercase
  "Toko Kue": "#D4A373",          // Tan
  "toko kue": "#D4A373",          // lowercase
  "Toko makanan": "#FF8C42",      // Mango Orange
  "Toko Makanan": "#FF8C42",      // capitalized
  "toko makanan": "#FF8C42",      // lowercase
  
  // Kategori Fashion - Purple & Pink tones
  "Fashion & Pakaian": "#9B59B6", // Amethyst Purple
  "fashion & pakaian": "#9B59B6", // lowercase
  "Pakaian": "#8E44AD",           // Wisteria Purple
  "pakaian": "#8E44AD",           // lowercase
  "Toko Pakaian": "#A855F7",      // Purple 500
  "toko pakaian": "#A855F7",      // lowercase
  "Toko Sepatu": "#6C5B7B",       // Dark Purple
  "toko sepatu": "#6C5B7B",       // lowercase
  "Toko Aksesoris": "#B565D8",    // Medium Purple
  "toko aksesoris": "#B565D8",    // lowercase
  "Toko aksesoris": "#B565D8",    // mixed case
  "Toko Benang": "#D8BFD8",       // Thistle
  "toko benang": "#D8BFD8",       // lowercase
  
  // Kategori Kerajinan - Red & Maroon tones
  "Kerajinan Tangan": "#DC2626",  // Bright Red
  "kerajinan tangan": "#DC2626",  // lowercase
  "Kerajinan": "#C92A2A",         // Dark Red
  "kerajinan": "#C92A2A",         // lowercase
  
  // Kategori Jasa - Blue & Cyan tones
  "Jasa": "#0EA5E9",              // Sky Blue
  "jasa": "#0EA5E9",              // lowercase
  "Layanan Jasa": "#06B6D4",      // Cyan
  "layanan jasa": "#06B6D4",      // lowercase
  "Laundry": "#38BDF8",           // Light Blue
  "laundry": "#38BDF8",           // lowercase
  "Studio Fotografi": "#0284C7",  // Dark Cyan
  "studio fotografi": "#0284C7",  // lowercase
  "Toko Percetakan": "#0369A1",   // Deep Blue
  "toko percetakan": "#0369A1",   // lowercase
  "Toko percetakan": "#0369A1",   // mixed case
  
  // Kategori Elektronik - Indigo & Blue tones
  "Elektronik": "#4F46E5",        // Indigo
  "elektronik": "#4F46E5",        // lowercase
  "Toko Elektronik": "#6366F1",   // Light Indigo
  "toko elektronik": "#6366F1",   // lowercase
  
  // Kategori Kesehatan - Pink & Rose tones
  "Kesehatan & Kecantikan": "#EC4899", // Pink
  "kesehatan & kecantikan": "#EC4899", // lowercase
  "Kesehatan": "#F472B6",         // Light Pink
  "kesehatan": "#F472B6",         // lowercase
  "Kecantikan": "#BE185D",        // Dark Pink
  "kecantikan": "#BE185D",        // lowercase
  "Salon Kecantikan": "#F9A8D4",  // Pink Rose
  "salon kecantikan": "#F9A8D4",  // lowercase
  "Pusat Kebugaran": "#DB2777",   // Hot Pink
  "pusat kebugaran": "#DB2777",   // lowercase
  
  // Kategori Retail - Green tones
  "Toko Buah dan Sayuran": "#10B981", // Emerald Green
  "toko buah dan sayuran": "#10B981", // lowercase
  "Toko Buah dan Sayur": "#10B981",   // Emerald Green (alias)
  "toko buah dan sayur": "#10B981",   // lowercase
  "Toko bahan makanan": "#14B8A6",    // Teal
  "toko bahan makanan": "#14B8A6",    // lowercase
  "Toko Bahan Makanan": "#14B8A6",    // capitalized
  "Toko Perlengkapan Rumah": "#059669", // Dark Green
  "toko perlengkapan rumah": "#059669", // lowercase
  "Warung Kelontong": "#16A34A",      // Green
  "warung kelontong": "#16A34A",      // lowercase
  "Toko Kelontong": "#16A34A",        // Green
  "toko kelontong": "#16A34A",        // lowercase
  "Toko Mebel": "#047857",            // Dark Emerald
  "toko mebel": "#047857",            // lowercase
  "Toko Perlengkapan Bayi": "#34D399", // Light Green
  "toko perlengkapan bayi": "#34D399", // lowercase
  "Toko Bunga": "#22C55E",            // Bright Green
  "toko bunga": "#22C55E",            // lowercase
  "Toko Pakan Hewan": "#15803D",      // Forest Green
  "toko pakan hewan": "#15803D",      // lowercase
  
  // Kategori Khusus - Violet & Other
  "Pusat Perbelanjaan": "#7C3AED",    // Violet
  "pusat perbelanjaan": "#7C3AED",    // lowercase
  "Toko Alat Pancing": "#2563EB",     // Blue
  "toko alat pancing": "#2563EB",     // lowercase
};