import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db: any = null;

export async function getDatabase() {
  if (db) {
    return db;
  }

  db = await open({
    filename: path.join(process.cwd(), 'umkm.db'),
    driver: sqlite3.Database,
  });

  await db.exec('PRAGMA foreign_keys = ON');
  return db;
}

export interface UMKM {
  no: number;
  nama_perusahaan: string;
  jenis: string;
  kecamatan: string;
  alamat: string;
  latitude: number;
  longitude: number;
  waktu_buka: string;
}
