'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';

interface UMKM {
  no: number;
  name: string;
  category: string;
  district: string;
  address: string;
  gambar?: string;
}

export default function InputGambarPage() {
  const [umkmList, setUmkmList] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchUMKMData();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data UMKM...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Input Gambar UMKM</h1>
          <p className="text-gray-600">
            Upload gambar untuk setiap UMKM. Halaman ini bersifat sementara untuk keperluan input data.
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">⚠️ Catatan:</span> Format yang didukung: JPG, PNG, GIF, WebP. Ukuran maksimal: 5MB
            </p>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* UMKM List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {umkmList.map((umkm) => (
            <div 
              key={umkm.no} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col"
            >
              {/* UMKM Info - Fixed Height */}
              <div className="mb-4" style={{ minHeight: '140px' }}>
                <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">{umkm.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {umkm.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Kecamatan:</span> {umkm.district}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">{umkm.address}</p>
              </div>

              {/* Current Image or Preview */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  {previewUrls[umkm.no] ? 'Preview Gambar Baru:' : umkm.gambar ? 'Gambar Saat Ini:' : 'Belum Ada Gambar'}
                </p>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
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
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pilih Gambar
                  </label>
                  <input
                    id={`file-input-${umkm.no}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(umkm.no, e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                    disabled={uploading === umkm.no}
                  />
                  {selectedFiles[umkm.no] && (
                    <p className="mt-1 text-xs text-gray-500">
                      {selectedFiles[umkm.no]!.name} ({(selectedFiles[umkm.no]!.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => handleImageUpload(umkm.no)}
                  disabled={uploading === umkm.no || !selectedFiles[umkm.no]}
                  className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    uploading === umkm.no || !selectedFiles[umkm.no]
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'
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
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    ✓ Sudah ada gambar
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                    Belum ada gambar
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Ringkasan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{umkmList.length}</p>
              <p className="text-sm text-gray-600">Total UMKM</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {umkmList.filter(u => u.gambar).length}
              </p>
              <p className="text-sm text-gray-600">Sudah Ada Gambar</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {umkmList.filter(u => !u.gambar).length}
              </p>
              <p className="text-sm text-gray-600">Belum Ada Gambar</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {umkmList.length > 0 ? Math.round((umkmList.filter(u => u.gambar).length / umkmList.length) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600">Progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
