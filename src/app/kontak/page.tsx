'use client';

import { useState } from 'react';
import Header from '@/components/Header';

export default function Kontak() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi pengiriman form
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: 'location_on',
      title: 'Alamat',
      content: 'Jl. Sutisna Senjaya, Tasikmalaya, Jawa Barat 46116',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: 'mail',
      title: 'Email',
      content: 'info@umkmtasikmalaya.com',
      link: 'mailto:info@umkmtasikmalaya.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'phone',
      title: 'Telepon',
      content: '+62 812-3456-7890',
      link: 'tel:+6281234567890',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'schedule',
      title: 'Jam Operasional',
      content: 'Senin - Jumat: 08:00 - 17:00 WIB',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const socialMedia = [
    { icon: 'facebook', name: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: 'instagram', name: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: 'twitter', name: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: 'whatsapp', name: 'WhatsApp', color: 'hover:bg-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm mb-6">
              <span className="material-icons text-emerald-600 dark:text-emerald-500 text-sm">mail</span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Hubungi Kami</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Mari <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Terhubung</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Punya pertanyaan atau saran? Tim kami siap membantu Anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-icons text-emerald-600">info</span>
                  Informasi Kontak
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                          <span className="material-icons text-white">{info.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {info.title}
                          </h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-gray-600 dark:text-gray-400">
                              {info.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-8 text-white shadow-xl">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-icons">share</span>
                  Media Sosial
                </h2>
                <p className="text-white/90 mb-6">
                  Ikuti kami di media sosial untuk update terbaru
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {socialMedia.map((social, index) => (
                    <button
                      key={index}
                      className={`flex items-center justify-center gap-2 p-3 bg-white/20 backdrop-blur-sm rounded-xl ${social.color} transition-all duration-300 group`}
                    >
                      <span className="material-icons group-hover:scale-110 transition-transform">
                        {social.icon === 'facebook' ? 'facebook' : 
                         social.icon === 'instagram' ? 'camera_alt' : 
                         social.icon === 'twitter' ? 'tag' : 'chat'}
                      </span>
                      <span className="font-medium">{social.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-icons text-emerald-600">edit_note</span>
                  Kirim Pesan
                </h2>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
                    <span className="material-icons text-green-600 dark:text-green-400">check_circle</span>
                    <p className="text-green-800 dark:text-green-400 font-medium">
                      Pesan Anda berhasil terkirim! Kami akan segera menghubungi Anda.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          person
                        </span>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="Masukkan nama Anda"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          mail
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nomor Telepon
                      </label>
                      <div className="relative">
                        <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          phone
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="08xx-xxxx-xxxx"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Subjek <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          label
                        </span>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Pilih Subjek</option>
                          <option value="pertanyaan">Pertanyaan Umum</option>
                          <option value="daftar-umkm">Pendaftaran UMKM</option>
                          <option value="kerjasama">Kerjasama</option>
                          <option value="masukan">Saran & Masukan</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                        <span className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Pesan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tuliskan pesan Anda di sini..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-icons animate-spin">refresh</span>
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-icons group-hover:translate-x-1 transition-transform">send</span>
                        <span>Kirim Pesan</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="material-icons text-emerald-600">place</span>
              Lokasi Kami
            </h2>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <span className="material-icons text-6xl text-gray-400 dark:text-gray-500 mb-4">map</span>
                <p className="text-gray-600 dark:text-gray-400">
                  Peta lokasi akan ditampilkan di sini
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Preview */}
          <div className="mt-16 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-12 text-center border border-emerald-100 dark:border-gray-600">
            <span className="material-icons text-6xl text-emerald-600 dark:text-emerald-500 mb-4">help</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Punya Pertanyaan?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Lihat FAQ kami untuk jawaban cepat atas pertanyaan umum
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <span>Lihat FAQ</span>
              <span className="material-icons">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-16">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-gray-400">© 2025 UMKM Tasikmalaya. Mendukung pertumbuhan ekonomi lokal.</p>
        </div>
      </footer>
    </div>
  );
}
