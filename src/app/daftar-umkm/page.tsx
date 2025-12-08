'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import HeaderSection from '@/components/daftar-umkm/HeaderSection';
import FilterBar from '@/components/daftar-umkm/FilterBar';
import UMKMGrid from '@/components/daftar-umkm/UMKMGrid';
import UMKMList from '@/components/daftar-umkm/UMKMList';
import FooterSection from '@/components/beranda/FooterSection';
import Toast from '@/components/Toast';

interface UMKM {
  no: string; // UUID
  name: string;
  category: string;
  district: string;
  description: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  operatingHours: string;
  gambar?: string | null;
  tentang?: string | null;
}

export default function DaftarUMKM() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [umkms, setUmkms] = useState<UMKM[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'choose' | 'add' | 'edit'>('choose');
  const [selectedUMKMId, setSelectedUMKMId] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    nama_perusahaan: '',
    jenis: '',
    kecamatan: '',
    alamat: '',
    telepon: '',
    waktu_buka: '',
    latitude: '',
    longitude: '',
    password: '',
    tentang: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'info'
  });
  const itemsPerPage = 9;

  useEffect(() => {
    // Fetch data UMKM dari API database
    const fetchUMKMs = async () => {
      try {
        const response = await fetch('/api/umkm');
        const data = await response.json();
        setUmkms(data);
      } catch (error) {
        console.error('Error fetching UMKM data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUMKMs();
  }, []);

  const categories = ['Semua', ...Array.from(new Set(umkms.map(u => u.category)))];

  const filteredAndSortedUMKMs = useMemo(() => {
    let result = umkms.filter(umkm => {
      const matchesSearch = umkm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           umkm.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || umkm.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.category.localeCompare(b.category);
      }
    });

    return result;
  }, [umkms, searchQuery, selectedCategory, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedUMKMs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUMKMs = filteredAndSortedUMKMs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setModalMode('choose');
    resetForm();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMode('choose');
    setIsAuthenticated(false);
    setSelectedUMKMId('');
    setPasswordInput('');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nama_perusahaan: '',
      jenis: '',
      kecamatan: '',
      alamat: '',
      telepon: '',
      waktu_buka: '',
      latitude: '',
      longitude: '',
      password: '',
      tentang: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
    setMessage(null);
  };

  const handleModeSelect = (mode: 'add' | 'edit') => {
    setModalMode(mode);
    if (mode === 'add') {
      resetForm();
    }
  };

  const handleVerifyPassword = async () => {
    if (!selectedUMKMId || !passwordInput) {
      setMessage({ type: 'error', text: 'Pilih UMKM dan masukkan password' });
      return;
    }

    try {
      const umkm = umkms.find(u => u.no === selectedUMKMId);
      if (!umkm) {
        setMessage({ type: 'error', text: 'UMKM tidak ditemukan' });
        return;
      }

      // Verify password with database
      const response = await fetch(`/api/umkm/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedUMKMId, password: passwordInput })
      });

      const result = await response.json();

      if (response.ok && result.valid) {
        setIsAuthenticated(true);
        setMessage({ type: 'success', text: 'Password benar! Anda dapat mengedit data.' });
        
        // Load UMKM data to form
        const umkmResponse = await fetch(`/api/umkm?id=${selectedUMKMId}`);
        const umkmData = await umkmResponse.json();
        
        if (umkmData) {
          setFormData({
            nama_perusahaan: umkmData.nama_perusahaan || '',
            jenis: umkmData.jenis || '',
            kecamatan: umkmData.kecamatan || '',
            alamat: umkmData.alamat || '',
            telepon: umkmData.telepon || '',
            waktu_buka: umkmData.waktu_buka || '',
            latitude: umkmData.latitude?.toString() || '',
            longitude: umkmData.longitude?.toString() || '',
            password: '',
            tentang: umkmData.tentang || ''
          });
          if (umkmData.gambar_url) {
            setImagePreview(umkmData.gambar_url);
          }
        }
      } else {
        setMessage({ type: 'error', text: 'Password salah!' });
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (modalMode === 'add') {
        // Create new UMKM
        const response = await fetch('/api/umkm/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          // If there's an image, upload it
          if (selectedImage && result.data?.id) {
            const imageFormData = new FormData();
            imageFormData.append('id', result.data.id);
            imageFormData.append('file', selectedImage);

            const imageResponse = await fetch('/api/umkm/update-image', {
              method: 'POST',
              body: imageFormData,
            });

            if (!imageResponse.ok) {
              console.error('Failed to upload image');
            }
          }

          setToast({
            show: true,
            message: 'UMKM berhasil ditambahkan!',
            type: 'success'
          });
        } else {
          setToast({
            show: true,
            message: result.error || 'Gagal menambahkan UMKM',
            type: 'error'
          });
        }
      } else if (modalMode === 'edit') {
        // Update existing UMKM
        const response = await fetch('/api/umkm/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedUMKMId,
            ...formData
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // If there's a new image, upload it
          if (selectedImage) {
            const imageFormData = new FormData();
            imageFormData.append('id', selectedUMKMId);
            imageFormData.append('file', selectedImage);

            const imageResponse = await fetch('/api/umkm/update-image', {
              method: 'POST',
              body: imageFormData,
            });

            if (!imageResponse.ok) {
              console.error('Failed to upload image');
            }
          }

          setToast({
            show: true,
            message: 'UMKM berhasil diupdate!',
            type: 'success'
          });
        } else {
          setToast({
            show: true,
            message: result.error || 'Gagal mengupdate UMKM',
            type: 'error'
          });
        }
      }

      // Refresh data
      const refreshResponse = await fetch('/api/umkm');
      const refreshedData = await refreshResponse.json();
      setUmkms(refreshedData);

      // Close modal immediately
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting UMKM:', error);
      setToast({
        show: true,
        message: 'Terjadi kesalahan',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Toast Alert */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Fixed Green Blur Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-green"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-green-500/30 rounded-full blur-3xl animate-pulse-green-delay-1"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl animate-pulse-green-delay-2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-green"></div>
      </div>

      <Header />
      
      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <HeaderSection />

          {/* Add/Edit UMKM Button - Centered */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/50 font-semibold"
            >
              <span className="material-icons">add_business</span>
              <span>Kelola UMKM</span>
            </button>
          </div>

          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            viewMode={viewMode}
            setViewMode={setViewMode}
            filteredCount={filteredAndSortedUMKMs.length}
            totalCount={umkms.length}
          />

          {viewMode === 'grid' ? (
            <UMKMGrid umkms={currentUMKMs} loading={loading} />
          ) : (
            <UMKMList umkms={currentUMKMs} loading={loading} />
          )}

          {/* Pagination */}
          {!loading && filteredAndSortedUMKMs.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-6">
              {/* Page Info */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredAndSortedUMKMs.length)} dari {filteredAndSortedUMKMs.length} UMKM
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <span className="material-icons text-lg">chevron_left</span>
                  <span className="hidden sm:inline"></span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    // Show ellipsis
                    const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <span key={page} className="px-2 text-gray-400 dark:text-gray-600">
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <span className="hidden sm:inline"></span>
                  <span className="material-icons text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal UMKM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons text-emerald-500">
                  {modalMode === 'choose' ? 'business' : modalMode === 'add' ? 'add_business' : 'edit'}
                </span>
                {modalMode === 'choose' ? 'Kelola UMKM' : modalMode === 'add' ? 'Tambah UMKM Baru' : 'Edit UMKM'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <span className="material-icons text-gray-500">close</span>
              </button>
            </div>

            {/* Choose Mode */}
            {modalMode === 'choose' && (
              <div className="p-8 space-y-4">
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                  Pilih tindakan yang ingin Anda lakukan
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleModeSelect('add')}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                  >
                    <span className="material-icons text-4xl text-emerald-500">add_circle</span>
                    <span className="font-semibold text-gray-900 dark:text-white">Tambah UMKM Baru</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Daftarkan UMKM baru ke sistem
                    </span>
                  </button>
                  <button
                    onClick={() => handleModeSelect('edit')}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <span className="material-icons text-4xl text-blue-500">edit</span>
                    <span className="font-semibold text-gray-900 dark:text-white">Edit UMKM</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Ubah data UMKM yang sudah ada
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Edit Mode - Select UMKM & Password */}
            {modalMode === 'edit' && !isAuthenticated && (
              <div className="p-6 space-y-4 max-h-[calc(90vh-80px)] overflow-y-auto">
                {message && (
                  <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                    {message.text}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Pilih UMKM *
                  </label>
                  <select
                    value={selectedUMKMId}
                    onChange={(e) => setSelectedUMKMId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih UMKM yang akan diedit</option>
                    {umkms.map(umkm => (
                      <option key={umkm.no} value={umkm.no}>
                        {umkm.name} - {umkm.district}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password UMKM *
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan password UMKM"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Password yang digunakan saat mendaftarkan UMKM
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalMode('choose')}
                    className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyPassword}
                    className="flex-1 px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 font-semibold transition-colors"
                  >
                    Verifikasi
                  </button>
                </div>
              </div>
            )}

            {/* Form (Add or Edit after authenticated) */}
            {(modalMode === 'add' || (modalMode === 'edit' && isAuthenticated)) && (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(90vh-80px)] overflow-y-auto">
              {message && (
                <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                  {message.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nama Perusahaan *
                </label>
                <input
                  type="text"
                  name="nama_perusahaan"
                  value={formData.nama_perusahaan}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Contoh: Toko Elektronik Jaya"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Jenis Usaha *
                </label>
                <select
                  name="jenis"
                  value={formData.jenis}
                  onChange={handleInputChange}
                  required
                  size={1}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent overflow-y-auto"
                  style={{ maxHeight: '48px' }}
                >
                  <option value="">Pilih Jenis Usaha</option>
                  {categories.filter(cat => cat !== 'Semua').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Kecamatan *
                </label>
                <input
                  type="text"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Contoh: Mangkubumi"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Alamat Lengkap *
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Jl. Contoh No. 123, Kec. Mangkubumi, Kab. Tasikmalaya"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="0812345678"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Jam Operasional
                </label>
                <input
                  type="text"
                  name="waktu_buka"
                  value={formData.waktu_buka}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="08.00 - 17.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tentang UMKM
                </label>
                <textarea
                  name="tentang"
                  value={formData.tentang}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Deskripsi singkat tentang UMKM, produk/layanan yang ditawarkan, dll."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="-7.327"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="108.22"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Gambar UMKM
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/30 dark:file:text-emerald-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Format: JPG, PNG. Maksimal 5MB</p>
                
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                )}
              </div>

              {modalMode === 'add' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Password untuk akses UMKM"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Password akan digunakan untuk login dan edit data UMKM</p>
                </div>
              )}

              {modalMode === 'edit' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password Baru (opsional)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Kosongkan jika tidak ingin mengubah password"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Isi jika ingin mengubah password</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => modalMode === 'add' ? setModalMode('choose') : handleCloseModal()}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors"
                >
                  {modalMode === 'add' ? 'Kembali' : 'Batal'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    modalMode === 'add' 
                      ? 'bg-emerald-500 hover:bg-emerald-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {submitting ? 'Menyimpan...' : modalMode === 'add' ? 'Tambah' : 'Update'}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}

      <div>
        <FooterSection />
      </div>
    </div>
  );
}
