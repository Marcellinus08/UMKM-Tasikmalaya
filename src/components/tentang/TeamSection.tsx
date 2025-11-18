import Image from 'next/image';

interface TeamMember {
  name: string;
  prodi: string;
  icon: string;
  avatar?: string;
  color: string;
  description: string;
}

export default function TeamSection() {
  const team: TeamMember[] = [
    {
      name: 'Marcellinus Geofani',
      prodi: 'S1 Teknik Komputer',
      icon: 'code',
      avatar: '/marcel_avatar.jpeg',
      color: 'from-emerald-500 to-teal-500',
      description: 'Pengembangan website'
    },
    {
      name: 'Otniel',
      prodi: 'S1 Teknik Komputer',
      avatar: '/abuy.jpeg',
      icon: 'palette',
      color: 'from-purple-500 to-pink-500',
      description: 'Pengumpulan data'
    }
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm mb-6">
          <span className="material-icons text-emerald-600 dark:text-emerald-500 text-sm">groups</span>
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500">Tim Pengembang</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Tim <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Pembuat Platform</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Mahasiswa Universitas Telkom yang berkomitmen mengembangkan ekosistem digital untuk UMKM Tasikmalaya
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
        {team.map((member, index) => (
          <div
            key={index}
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 w-full sm:w-64"
          >
            {member.avatar ? (
              <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-110 transition-all shadow-lg border-4 border-emerald-500">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className={`w-28 h-28 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                <span className="material-icons text-white text-5xl">{member.icon}</span>
              </div>
            )}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {member.name}
              </h3>
              <div className="text-emerald-600 dark:text-emerald-500 font-semibold mb-1">
                {member.prodi}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {member.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
