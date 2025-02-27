import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, TooltipItem, ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import pb from '../../../../services/pocketBaseClient';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define status colors
const statusColors: Record<string, string> = {
  'issued': 'rgba(201, 203, 207, 0.8)', // Gray
  'pending': 'rgba(255, 205, 86, 0.8)', // Yellow
  'processing': 'rgba(54, 162, 235, 0.8)', // Blue
  'resolved': 'rgba(75, 192, 192, 0.8)', // Green
  'rejected': 'rgba(255, 99, 132, 0.8)', // Red
  'default': 'rgba(153, 102, 255, 0.8)' // Purple (for other statuses)
};

interface DisputeRecord {
  status: string;
}

// Define stronger typing for the chart
type PieChartData = ChartData<'pie', number[], string>;

const DisputeStats = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<PieChartData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all disputes
        const records = await pb.collection('disputes').getFullList<DisputeRecord>({
          sort: 'created',
        });

        // Group by status
        const statusCounts: Record<string, number> = {};
        records.forEach(record => {
          const status = record.status || 'unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        // Prepare chart data
        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);
        const backgroundColor = labels.map(label =>
          statusColors[label] || statusColors.default
        );

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of disputes',
              data,
              backgroundColor,
              borderColor: backgroundColor.map(color => color.replace('0.8', '1')),
              borderWidth: 1,
            },
          ],
        });
      } catch (err: any) {
        console.error('Error fetching dispute data:', err);
        // Ignore the autocancelled error but log it
        if (err.message && err.message.includes('autocancelled')) {
          console.log('Ignoring autocancelled request');
        } else {
          setError(err.message || 'Failed to load dispute statistics');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define options with proper typing
  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'pie'>) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: true,
        text: 'Disputes by Status',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    layout: {
      padding: 20
    },
    maintainAspectRatio: false
  };

  // Calculate total disputes safely
  const totalDisputes = chartData?.datasets[0]?.data.reduce((sum: number, val: number) => sum + val, 0) || 0;

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-lg p-6 h-full">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-lg p-6">
        <div className="text-error text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">Error loading data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-primary">Dispute Statistics</h2>
      <div className="h-64">
        {chartData ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No dispute data available</p>
          </div>
        )}
      </div>
      <div className="mt-4 text-sm text-center text-gray-500">
        Total Disputes: {totalDisputes}
      </div>
    </div>
  );
};

export default DisputeStats;
