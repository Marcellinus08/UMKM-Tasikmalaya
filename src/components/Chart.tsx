'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { UMKMS, CAT_COLOR } from '@/data/umkm';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// District Chart Options
export const growthOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Total UMKM per Kecamatan',
      color: '#6B7280',
      font: {
        size: 14,
        weight: 'bold' as const,
      },
      padding: {
        bottom: 20
      }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        stepSize: 1,
        font: {
          size: 12,
        },
      }
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
        },
      }
    },
  },
  elements: {
    line: {
      tension: 0.4, // Makes the line curve smooth
    },
    point: {
      radius: 6,
      hoverRadius: 8,
      backgroundColor: '#10B981',
      borderColor: '#ffffff',
      borderWidth: 2,
    },
  },
};

// Distribution Chart Options
export const distributionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
  },
};

interface ChartProps {
  variant: 'growth' | 'distribution';
  data?: Array<{
    no: number;
    name: string;
    category: string;
    district: string;
    description: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
    operatingHours: string;
  }>;
}

// Get District Data
const getDistrictData = (umkms: any[]) => {
  if (!umkms || umkms.length === 0) {
    return { labels: [], data: [] };
  }

  const districts = umkms.map(umkm => {
    // Gunakan field district dari data, jika tidak ada gunakan parsing dari address
    const district = umkm.district || umkm.address.split(',')[1]?.trim() || 'Unknown';
    return district;
  });

  const districtCounts = districts.reduce((acc, district) => {
    acc[district] = (acc[district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDistricts = Object.entries(districtCounts)
    .sort((a, b) => (b[1] as number) - (a[1] as number));

  return {
    labels: sortedDistricts.map(([district]) => district),
    data: sortedDistricts.map(([, count]) => count)
  };
};

// Get Category Distribution Data
const getCategoryData = (umkms: any[], catColor: Record<string, string>) => {
  if (!umkms || umkms.length === 0) {
    return { data: [], colors: [], labels: [] };
  }

  const categoryCounts = umkms.reduce((acc, { category }) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Hanya ambil kategori yang ada di data
  const availableCategories = Object.keys(categoryCounts).filter(cat => categoryCounts[cat] > 0);
  
  // Color palette untuk fallback
  const colorPalette = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B88B", "#D5A6BD",
    "#A8E6CF", "#FFD3B6", "#FFAAA5", "#FF8B94", "#A8D8EA"
  ];
  
  return {
    labels: availableCategories,
    data: availableCategories.map(category => categoryCounts[category]),
    colors: availableCategories.map((category, index) => 
      catColor[category] || colorPalette[index % colorPalette.length]
    )
  };
};

export default function Chart({ variant, data }: ChartProps) {
  const umkms = data || [];
  
  const CAT_COLOR_FALLBACK: Record<string, string> = {
    // Kategori Utama
    "Kuliner": "#F97316",
    "Restoran": "#FF6B35",
    "Warung nasi": "#FB923C",
    "Fashion & Pakaian": "#8B5CF6",
    "Pakaian": "#A78BFA",
    "Toko Pakaian": "#D8B4FE",
    "Kerajinan Tangan": "#DC2626",
    "Kerajinan": "#EF4444",
    "Jasa": "#0EA5E9",
    "Layanan Jasa": "#0284C7",
    "Elektronik": "#6366F1",
    "Toko Elektronik": "#818CF8",
    "Kesehatan & Kecantikan": "#EC4899",
    "Kesehatan": "#F472B6",
    "Kecantikan": "#FB7185",
    // Kategori tambahan dari database
    "Toko Buah dan Sayuran": "#22C55E",
    "Toko bahan makanan": "#84CC16",
    "Toko Perlengkapan Rumah": "#14B8A6",
    "Kedai Kopi": "#92400E",
    "Toko Sepatu": "#7C2D12",
    "Pusat Perbelanjaan": "#9333EA",
  };

  if (variant === 'growth') {
    const locationData = getDistrictData(umkms);
    const growthData = {
      labels: locationData.labels,
      datasets: [
        {
          label: 'Jumlah UMKM',
          data: locationData.data,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };

    return (
      <Line
        options={growthOptions}
        data={growthData}
        className="transition-opacity duration-300"
      />
    );
  }

  const categoryData = getCategoryData(umkms, CAT_COLOR_FALLBACK);
  const distributionData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.data,
        backgroundColor: categoryData.colors,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  return (
    <Pie
      options={distributionOptions}
      data={distributionData}
      className="transition-opacity duration-300"
    />
  );
}