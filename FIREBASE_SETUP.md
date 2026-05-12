# Firebase Migration - Setup Instructions

## 1. Create Firebase Project

Go to [Firebase Console](https://console.firebase.google.com/) and:
- Create a new project or select an existing one
- Enable Firestore Database
- Enable Cloud Storage
- Create a web app and copy the configuration

## 2. Set Up Environment Variables

Add these variables to your `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 3. Create Firestore Collections

Create the following collections in Firestore:

### Collection: `umkm`
Fields in each document:
- `id` (document ID - auto-generated or custom)
- `nama_perusahaan` (string)
- `jenis` (string - category)
- `kecamatan` (string - district)
- `alamat` (string - address)
- `latitude` (number)
- `longitude` (number)
- `waktu_buka` (string - operating hours)
- `telepon` (string - optional)
- `gambar_url` (string - optional, image URL from storage)
- `password` (string - for authentication)
- `tentang` (string - optional, description)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Collection: `contact_messages`
Fields in each document:
- `full_name` (string)
- `email` (string)
- `phone` (string - optional)
- `subject` (string)
- `message` (string)
- `status` (string - default "new")
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 4. Set Up Cloud Storage

Create a bucket in Firebase Cloud Storage (if not auto-created):
- Bucket name: `your_project.appspot.com`
- Create a folder `umkm/` for storing UMKM images

### Storage Security Rules (Firestore Rules should be):

```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /umkm/{document=**} {
      allow read;
      allow write: if request.auth != null;
    }
    match /contact_messages/{document=**} {
      allow write: if true;
      allow read: if request.auth != null;
    }
  }
}
```

## 5. Set Up Firebase Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /umkm/{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

## 6. Convert Excel to Firestore

To import your Excel data into Firebase:

### Option A: Using Firebase Console (Simple)
1. Export your Excel as CSV
2. Go to Firestore → Collection → Import
3. Upload the CSV file

### Option B: Using Scripts
You can create a Node.js script to import the data:

```javascript
// import-data.js
const admin = require('firebase-admin');
const ExcelJS = require('exceljs');

admin.initializeApp();
const db = admin.firestore();

async function importData() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('./data.xlsx');
  const worksheet = workbook.getWorksheet(1);

  worksheet.eachRow(async (row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header
    
    const data = {
      nama_perusahaan: row.getCell(1).value,
      jenis: row.getCell(2).value,
      kecamatan: row.getCell(3).value,
      alamat: row.getCell(4).value,
      latitude: parseFloat(row.getCell(5).value),
      longitude: parseFloat(row.getCell(6).value),
      waktu_buka: row.getCell(7).value,
      telepon: row.getCell(8).value || null,
      password: 'default_password',
      tentang: row.getCell(9).value || null,
      gambar_url: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('umkm').add(data);
  });
}

importData().catch(console.error);
```

## 7. Verify Migration

Test the following endpoints:
- GET `/api/umkm` - Fetch all UMKM
- GET `/api/umkm?id=<id>` - Fetch single UMKM
- POST `/api/umkm/create` - Create new UMKM
- POST `/api/contact` - Submit contact form
- POST `/api/umkm/verify-password` - Verify password

## 8. Database Schema Migration Tips

If you need to migrate existing data:
1. Export data from Supabase
2. Transform to match Firestore format
3. Use batch writes for better performance:

```javascript
const batch = db.batch();
data.forEach((item) => {
  const ref = db.collection('umkm').doc();
  batch.set(ref, item);
});
await batch.commit();
```

## Removed Dependency

The `@supabase/supabase-js` package has been replaced with `firebase`. You can optionally run:
```bash
npm uninstall @supabase/supabase-js
```

## Notes

- All API endpoints have been updated to use Firebase
- Image uploads now use Firebase Cloud Storage
- Firestore is NoSQL, so queries work differently (no full-text search by default)
- Ensure you have proper security rules set for production
- All timestamps should use `new Date()` for server-side timestamps
