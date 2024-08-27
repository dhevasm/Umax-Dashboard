"use client";

import React, { useEffect, useState, useContext, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AdminDashboardContext } from '@/app/[locale]/admin-dashboard/page';

// Dynamically import ApexCharts to ensure compatibility with Next.js
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const ChartFour = ({ chartData }) => {
  const { isDarkMode } = useContext(AdminDashboardContext);

  const [cityCounts, setCityCounts] = useState([]);

  useEffect(() => {
    if (chartData && chartData.city_counts) {
      const sortedCityCounts = Object.entries(chartData.city_counts)
        .sort((a, b) => b[1] - a[1]);
      setCityCounts(sortedCityCounts);
    }
  }, [chartData]);

  // Memoize series and options to prevent unnecessary recalculations
  const series = useMemo(() => [{
    name: 'Clients',
    data: cityCounts.map(([, count]) => count),
  }], [cityCounts]);

  const options = useMemo(() => ({
    chart: {
      type: 'bar',
      background: isDarkMode ? '#1E293B' : '#fff',
      foreColor: isDarkMode ? '#fff' : '#1E293B',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
      }
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: cityCounts.map(([city]) => city),
      labels: {
        style: {
          colors: isDarkMode ? '#fff' : '#333',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDarkMode ? '#fff' : '#333',
        },
      },
    },
    grid: {
      borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    title: {
      text: 'Client City',
      align: 'left',
      style: {
        color: isDarkMode ? "white" : "gray",
        fontSize: '18px',
        },
        margin: 20,
      offsetY: 20,
    },
    tooltip: {
      theme: isDarkMode ? "dark" : "light",
    },
    legend: {
      position: 'top',
      labels: {
        colors: isDarkMode ? "white" : "gray",
      },
    },
  }), [cityCounts, isDarkMode]);

  return (
    <div className="relative w-full h-96"> {/* Parent container with a fixed height */}
      <ApexCharts options={options} series={series} type="bar" height="100%" />
    </div>
  );
};

export default React.memo(ChartFour);
