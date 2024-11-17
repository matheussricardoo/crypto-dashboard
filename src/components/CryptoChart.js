'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CryptoChart({ data, isPositive, timeframe }) {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    switch (timeframe) {
      case '24h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '7d':
        return date.toLocaleDateString([], { weekday: 'short' });
      case '30d':
        return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  };

  const chartData = {
    labels: data.map(([timestamp]) => formatDate(timestamp)),
    datasets: [
      {
        data: data.map(([, price]) => price),
        fill: true,
        borderColor: isPositive ? '#22c55e' : '#ef4444',
        backgroundColor: isPositive 
          ? 'rgba(34, 197, 94, 0.1)'
          : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          },
          title: function(context) {
            return formatDate(data[context[0].dataIndex][0]);
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-32 w-full mt-4 chart-container">
      <Line data={chartData} options={options} key={`${timeframe}-${data.length}`} />
    </div>
  );
} 