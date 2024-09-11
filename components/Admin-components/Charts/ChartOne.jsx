"use client";

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useContext } from 'react';
import { AdminDashboardContext } from '@/app/[locale]/admin-dashboard/page';
import { useTranslations } from 'next-intl';

// Dynamically import ApexCharts to ensure it works with Next.js
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const ChartOne = ({ chartData }) => {
  const { isDarkMode } = useContext(AdminDashboardContext);
  const t = useTranslations('admin-dashboard');

  const [awareness, setAwareness] = useState(0);
  const [conversion, setConversion] = useState(0);
  const [consideration, setConsideration] = useState(0);

  useEffect(() => {
    if (chartData) {
      setAwareness(chartData.bar || 0);
      setConversion(chartData.bar2 || 0);
      setConsideration(chartData.bar3 || 0);
    }
  }, [chartData]);

  const series = useMemo(() => [
    {
      name: 'Campaign',
      data: [awareness, conversion, consideration],
    },
  ], [awareness, conversion, consideration]);

  const options = useMemo(() => ({
    chart: {
      type: 'bar',
      background: isDarkMode ? '#1E293B' : '#fff',
      foreColor: isDarkMode ? '#fff' : '#1E293B',
      toolbar: {
        show: true, // Show toolbar with additional options
        tools: {
          download: true, // Enable download button
          zoomin: false,   // Disable zoom-in button
          zoomout: false,  // Disable zoom-out button
          reset: true,    // Show reset button
        },
        export: {
          csv: {
            columnDelimiter: ',',
            headerCategory: 'Category',
            headerValue: 'Value',
            fileName: 'chart-data',
            mimeType: 'text/csv',
            useLocalTime: false,
          },
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '50%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Aware", "Conv", "Consid"],
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
    fill: {
      colors: [isDarkMode ? '#1A73E8' : '#1368DE'],
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light',
    },
    title: {
      text: t('campaign-objective'),
      style: {
        color: isDarkMode ? "white" : "gray",
      },
    },
  }), [isDarkMode]);

  return (
    <div className="relative w-full h-96">
      <ApexCharts options={options} series={series} type="bar" height="100%" />
    </div>
  );
};

export default ChartOne;
