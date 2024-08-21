"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors, Filler } from 'chart.js';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';
import { AdminDashboardContext } from '@/app/[locale]/admin-dashboard/page';
import { FaDownload } from 'react-icons/fa';

ChartJS.register(Filler, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartOne = ({ chartData }) => {
  const chartRef = useRef(null); // Reference to the chart
  const t = useTranslations("admin-dashboard");
  const {
    sidebarHide,
    setSidebarHide,
    updateCard,
    setUpdateCard,
    changeTable,
    setChangeTable,
    userData,
    dataDashboard,
    isDarkMode,
    setIsDarkMode
  } = useContext(AdminDashboardContext);

  const [awareness, setAwareness] = useState(0);
  const [conversion, setConversion] = useState(0);
  const [consideration, setConsideration] = useState(0);

  useEffect(() => {
    setAwareness(chartData.bar);
    setConversion(chartData.bar2);
    setConsideration(chartData.bar3);
  }, [chartData]);

  const data = {
    labels: ["Awareness", "Conversion", "Consideration"],
    datasets: [
      {
        label: 'Campaign',
        data: [awareness, conversion, consideration],
        backgroundColor: '#1368DE',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its parent container
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? "white" : "gray", // Change legend text color
        },
      },
      title: {
        display: true,
        text: 'Campaign Objective',
        color: isDarkMode ? "white" : "gray", // Change title text color,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "white" : "gray", // Change x-axis labels color,
        },
        grid: {
          color: isDarkMode ? "white" : "gray", // Optional: change grid line color,
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "white" : "gray", // Change y-axis labels color,
        },
        grid: {
          color: isDarkMode ? "white" : "gray", // Optional: change grid line color,
        },
      },
    },
  };

  const downloadChart = () => {
    const chart = chartRef.current;
    const link = document.createElement('a');
    link.href = chart.toBase64Image();
    link.download = 'objective-report.png';
    link.click();
  };

  return (
    <div className="relative w-full h-96"> {/* Parent container with a fixed height */}
      <Bar ref={chartRef} data={data} options={options} />
      <div
        className="absolute top-7 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={downloadChart}
      >
        <FaDownload className={`${isDarkMode ? "text-white" : "text-gray-500"} text-lg`} />
      </div>
    </div>
  );
};

export default ChartOne;
