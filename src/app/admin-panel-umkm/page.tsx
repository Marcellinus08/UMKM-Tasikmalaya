'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface UMKM {
  no: string; // UUID
  name: string;
  category: string;
  district: string;
  address: string;
  gambar?: string;
}

export default function InputGambarPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [umkmList, setUmkmList] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    // Check if already authenticated
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'authenticated') {
      setIsAuthenticated(true);
      fetchUMKMData();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sayasukasayasuka';
    
    if (password === correctPassword) {
      localStorage.setItem('adminAuth', 'authenticated');
      setIsAuthenticated(true);
      setAuthError('');
      setLoading(true);
      fetchUMKMData();
    } else {
      setAuthError('Password salah!');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    router.push('/');
  };

  const fetchUMKMData = async () => {
    try {
      const response = await fetch('/api/umkm');
      const data = await response.json();
      setUmkmList(data);
    } catch (error) {
      console.error('Error fetching UMKM:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (umkmId: number, file: File | null) => {
    if (!file) {
      setSelectedFiles(prev => ({ ...prev, [umkmId]: null }));
      setPreviewUrls(prev => {
        const newPreviews = { ...prev };
        if (newPreviews[umkmId]) {
          URL.revokeObjectURL(newPreviews[umkmId]);
          delete newPreviews[umkmId];
        }
        return newPreviews;
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'File harus berupa gambar (JPG, PNG, dll)' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran file maksimal 5MB' });
      return;
    }

    setSelectedFiles(prev => ({ ...prev, [umkmId]: file }));
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewUrls(prev => {
      if (prev[umkmId]) {
        URL.revokeObjectURL(prev[umkmId]);
      }
      return { ...prev, [umkmId]: previewUrl };
    });
  };

  const handleImageUpload = async (umkmId: number) => {
    const file = selectedFiles[umkmId];
    
    if (!file) {
      setMessage({ type: 'error', text: 'Pilih file gambar terlebih dahulu' });
      return;
    }

    setUploading(umkmId);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('id', umkmId.toString());
      formData.append('file', file);

      const response = await fetch('/api/umkm/update-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Gambar berhasil diupload untuk ${umkmList.find(u => u.no === umkmId)?.name}` 
        });
        
        // Update local state
        setUmkmList(prev => prev.map(umkm => 
          umkm.no === umkmId ? { ...umkm, gambar: result.imageUrl } : umkm
        ));

        // Clear selected file and preview
        setSelectedFiles(prev => ({ ...prev, [umkmId]: null }));
        if (previewUrls[umkmId]) {
          URL.revokeObjectURL(previewUrls[umkmId]);
          setPreviewUrls(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[umkmId];
            return newPreviews;
          });
        }

        // Clear file input
        const input = document.getElementById(`file-input-${umkmId}`) as HTMLInputElement;
        if (input) input.value = '';
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal mengupload gambar' });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat mengupload gambar' });
    } finally {
      setUploading(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
                <span className="material-icons text-emerald-600 dark:text-emerald-400 text-3xl">lock</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Masukkan password untuk melanjutkan</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                  autoFocus
                />
                {authError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="material-icons text-sm">error</span>
                    {authError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-linear-to-r from-emerald-500 to-green-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-green-600 transition-all shadow-md hover:shadow-lg"
              >
                Masuk
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center gap-1"
              >
                <span className="material-icons text-sm">arrow_back</span>
                Kembali ke Beranda
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Memuat data UMKM...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Input Gambar UMKM</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Upload gambar untuk setiap UMKM. Halaman ini bersifat sementara untuk keperluan input data.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span className="material-icons text-sm">logout</span>
              Logout
            </button>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">⚠️ Catatan:</span> Format yang didukung: JPG, PNG, GIF, WebP. Ukuran maksimal: 5MB
            </p>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
          }`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* UMKM List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {umkmList.map((umkm) => (
            <div 
              key={umkm.no} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col border border-gray-100 dark:border-gray-700"
            >
              {/* UMKM Info - Fixed Height */}
              <div className="mb-4" style={{ minHeight: '140px' }}>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1 line-clamp-2">{umkm.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {umkm.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span className="font-medium">Kecamatan:</span> {umkm.district}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{umkm.address}</p>
              </div>

              {/* Current Image or Preview */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
                  {previewUrls[umkm.no] ? 'Preview Gambar Baru:' : umkm.gambar ? 'Gambar Saat Ini:' : 'Belum Ada Gambar'}
                </p>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {previewUrls[umkm.no] ? (
                    <img 
                      src={previewUrls[umkm.no]} 
                      alt={`Preview ${umkm.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : umkm.gambar ? (
                    <img 
                      src={umkm.gambar} 
                      alt={umkm.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="14" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EGambar tidak valid%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Form */}
              <div className="space-y-3 mt-auto">
                <div>
                  <label 
                    htmlFor={`file-input-${umkm.no}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Pilih Gambar
                  </label>
                  <input
                    id={`file-input-${umkm.no}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(umkm.no, e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 dark:file:bg-emerald-900/30 file:text-emerald-700 dark:file:text-emerald-300 hover:file:bg-emerald-100 dark:hover:file:bg-emerald-900/50 file:cursor-pointer cursor-pointer"
                    disabled={uploading === umkm.no}
                  />
                  {selectedFiles[umkm.no] && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {selectedFiles[umkm.no]!.name} ({(selectedFiles[umkm.no]!.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => handleImageUpload(umkm.no)}
                  disabled={uploading === umkm.no || !selectedFiles[umkm.no]}
                  className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    uploading === umkm.no || !selectedFiles[umkm.no]
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 hover:shadow-md active:scale-95'
                  }`}
                >
                  {uploading === umkm.no ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengupload...
                    </span>
                  ) : (
                    '📤 Upload Gambar'
                  )}
                </button>
              </div>

              {/* Status Badge */}
              <div className="mt-3 flex justify-end">
                {umkm.gambar ? (
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                    ✓ Sudah ada gambar
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full font-medium">
                    Belum ada gambar
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Ringkasan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{umkmList.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total UMKM</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {umkmList.filter(u => u.gambar).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Sudah Ada Gambar</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {umkmList.filter(u => !u.gambar).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Belum Ada Gambar</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {umkmList.length > 0 ? Math.round((umkmList.filter(u => u.gambar).length / umkmList.length) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
