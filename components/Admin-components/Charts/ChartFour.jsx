"use client";

import React, { useEffect, useState, useContext, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AdminDashboardContext } from '@/app/[locale]/admin-dashboard/page';
import { useTranslations } from 'next-intl';
// Dynamically import ApexCharts to ensure compatibility with Next.js
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const ChartFour = ({ chartData }) => {
  const { isDarkMode } = useContext(AdminDashboardContext);
  const [cityCounts, setCityCounts] = useState([]);
  const t = useTranslations("admin-dashboard");

  useEffect(() => {
    if (chartData && chartData.city_counts) {
      const sortedCityCounts = Object.entries(chartData.city_counts)
        .sort((a, b) => b[1] - a[1]);
      setCityCounts(sortedCityCounts);
    }
  }, [chartData]);

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
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '25px',
        borderRadius: 5,
        colors: {
          backgroundBarColors: [
            '#93C5FD', // blue-300
          ],
          backgroundBarOpacity: 1,
          backgroundBarRadius: 5,
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
    xaxis: {
      categories: cityCounts.map(([city]) => city),
      labels: {
        show: false,  // Menghilangkan label pada x-axis
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
      strokeDashArray: 5,
    },
    title: {
      text: `${t("client-city")}`,
      align: 'left',
      style: {
        color: isDarkMode ? 'white' : 'gray',
        fontSize: '22px',
        fontWeight: 'bold',
      },
      margin: 20,
      offsetY: 20,
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light',
      marker: {
        show: true,
      },
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
            direction: rtl;
            overflow-y: auto;
            overflow-x: hidden;
            max-height: 400px;
          }

          .custom-scrollbar > div {
            direction: ltr;
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            background-color: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background-color: transparent;
          }
        `}
      </style>
      <div className="relative w-full h-96 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div style={{ height: cityCounts.length * 40 }} className='min-h-full'>
          <ApexCharts options={options} series={series} type="bar" height="100%" />
        </div>
      </div>
    </>
  );
};

export default React.memo(ChartFour);
