import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Daftarkan komponen Chart.js yang dibutuhkan (INIT WAJIB DILAKUKAN SEKALI)
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Warna Tailwind untuk Chart
export const STATUS_COLORS_MAP = {
    'Menunggu Pembayaran':      { color: '#9CA3AF', label: 'Menunggu Pembayaran' }, // Abu-abu
    'Sedang Diproses':   { color: '#FBBF24', label: 'Sedang Diproses' },   // Kuning
    'Dalam Perjalanan':      { color: '#60A5FA', label: 'Dalam Perjalanan' },   // Biru
    'Selesai':    { color: '#059669', label: 'Selesai' },            // Hijau Tua
    'Dibatalkan':     { color: '#F87171', label: 'Dibatalkan' },         // Merah
};

// --- 1. DOUGHNUT CHART (Status Pesanan) ---
export const OrderStatusChart = ({ chartData }) => {
    const data = {
        labels: chartData.labels, // Label Tampilan
        datasets: [
            {
                data: chartData.counts,
                backgroundColor: chartData.backgroundColors, 
                hoverBackgroundColor: chartData.backgroundColors.map(color => color), 
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs h-80">
            <h4 className="mb-4 font-semibold text-gray-800">Persentase Status Pesanan</h4>
            <div className="h-56">
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
};

// --- 2. BAR CHART (Produk Terlaris) ---
export const TopProductsChart = ({ chartData }) => {
    const data = {
        labels: chartData.labels, // Nama-nama Produk
        datasets: [
            {
                label: 'Total Terjual',
                data: chartData.data, // Jumlah Terjual
                backgroundColor: 'rgba(99, 102, 241, 0.8)', // Indigo-500
                hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Jumlah Terjual'
                }
            },
        },
    };

    return (
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs h-80">
            <h4 className="mb-4 font-semibold text-gray-800">Top 5 Produk Terlaris</h4>
            <div className="h-56">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};