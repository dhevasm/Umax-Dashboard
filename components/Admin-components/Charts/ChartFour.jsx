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
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '25px',  // Keep the bar height consistent
        borderRadius: 0,  // Make the bars not rounded
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels on the bars
    },
    xaxis: {
      categories: cityCounts.map(([city]) => city),
      labels: {
        style: {
          colors: isDarkMode ? '#fff' : '#333',
          fontSize: '12px',
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
      show: true,
      borderColor: isDarkMode ? '#444' : '#e7e7e7',
    },
    title: {
      text: 'Client City',
      align: 'left',
      style: {
        color: isDarkMode ? 'white' : 'gray',
        fontSize: '18px',
      },
      margin: 20,
      offsetY: 20,
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light',
    },
    legend: {
      position: 'top',
      labels: {
        colors: isDarkMode ? 'white' : 'gray',
      },
    },
  }), [cityCounts, isDarkMode]);

  return (
    <>
    <style jsx>
      {`
        .custom-scrollbar {
        direction: rtl; /* Change the direction to right-to-left */
        overflow-y: auto; /* Enable vertical scrolling */
        overflow-x: hidden; /* Disable horizontal scrolling */
        max-height: 400px; /* Example height */
      }

      .custom-scrollbar > div {
        direction: ltr; /* Reset the inner content direction to left-to-right */
      }

      /* Scrollbar styling (optional) */
      .custom-scrollbar::-webkit-scrollbar {
        display: none;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        display: none;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        display: none;
      }
      `
        }
    </style>
    <div className="relative w-full h-96 overflow-y-auto overflow-x-hidden custom-scrollbar">  {/* Enable vertical scrolling if data overflows */}
      <div style={{ height: cityCounts.length * 40 }} className='min-h-full'>  {/* Adjust height based on data */}
        <ApexCharts options={options} series={series} type="bar" height="100%" />
      </div>
    </div>
    </>
  );
};

export default React.memo(ChartFour);
