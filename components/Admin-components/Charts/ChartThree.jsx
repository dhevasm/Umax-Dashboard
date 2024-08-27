"use client";

import React, { useState, useEffect, useContext, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { AdminDashboardContext } from '@/app/[locale]/admin-dashboard/page';

// Dynamically import ApexCharts to ensure compatibility with Next.js
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const ChartThree = ({ chartData }) => {
  const t = useTranslations("admin-dashboard");
  const { isDarkMode } = useContext(AdminDashboardContext);

  const [meta, setMeta] = useState(0);
  const [google, setGoogle] = useState(0);
  const [tiktok, setTiktok] = useState(0);

  useEffect(() => {
    if (chartData) {
      setMeta(chartData.donut || 0);
      setGoogle(chartData.donut2 || 0);
      setTiktok(chartData.donut3 || 0);
    }
  }, [chartData]);

  // Memoize the series and options to avoid unnecessary recalculations
  const series = useMemo(() => [meta, google, tiktok], [meta, google, tiktok]);

  const options = useMemo(() => ({
    chart: {
      type: 'donut',
      background: isDarkMode ? '#1E293B' : '#fff',
      foreColor: isDarkMode ? '#fff' : '#1E293B',
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoomin: false,
          zoomout: false,
          reset: true,
        },
      },
    },
    labels: ["Meta", "Google", "Tiktok"],
    colors: ['#3B82F6', '#F7A102', '#1C1917'],
    legend: {
      position: 'bottom',
      labels: {
        colors: isDarkMode ? '#fff' : '#333',
        useSeriesColors: false,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 10,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              color: isDarkMode ? '#fff' : '#333',
            },
          },
        },
      },
    },
    title: {
      text: 'Campaign Platform',
      align: 'center',
      style: {
        color: isDarkMode ? "white" : "gray",
        fontSize: '18px',
      },
      margin: 50,
    },
    tooltip: {
      theme: isDarkMode ? "dark" : "dark",
    },
  }), [isDarkMode]);

  return (
    <div className="relative w-full h-96"> {/* Adjusted height to fit chart */}
      <ApexCharts options={options} series={series} type="donut" height="100%" />
    </div>
  );
};

export default React.memo(ChartThree);
