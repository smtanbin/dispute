import { useState } from 'react';
import DisputeStats from './modules/DisputeStats';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('all');

  return (

    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Dashboard</h1>

      {/* Date Range Controls */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="tabs tabs-boxed">
          <a
            className={`tab ${dateRange === 'today' ? 'tab-active' : ''}`}
            onClick={() => setDateRange('today')}
          >
            Today
          </a>
          <a
            className={`tab ${dateRange === 'week' ? 'tab-active' : ''}`}
            onClick={() => setDateRange('week')}
          >
            This Week
          </a>
          <a
            className={`tab ${dateRange === 'month' ? 'tab-active' : ''}`}
            onClick={() => setDateRange('month')}
          >
            This Month
          </a>
          <a
            className={`tab ${dateRange === 'all' ? 'tab-active' : ''}`}
            onClick={() => setDateRange('all')}
          >
            All Time
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="md:col-span-2 lg:col-span-1">
          <DisputeStats />
        </div>

        {/* Other stats/cards can go here */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Recent Disputes</h2>
            <p>List of recent disputes will go here</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Performance Metrics</h2>
            <p>Dispute resolution metrics will go here</p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Dashboard;
