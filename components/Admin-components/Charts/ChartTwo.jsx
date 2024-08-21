"use client";

import React, { useRef } from "react";
import { useContext } from "react";
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Line } from 'react-chartjs-2';
import { Filler } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { FaDownload } from "react-icons/fa";

ChartJS.register(
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartTwo = ({ chartData }) => {
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

  const [start, setStart] = useState([]);
  const [end, setEnd] = useState([]);

  useEffect(() => {
    setStart(chartData.line_start);
    setEnd(chartData.line_end);
  }, [chartData]);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Campaign Start',
        data: start,
        borderColor: '#60A5FA',
        tension: 0.3,
        backgroundColor: '#60A5FA',
        borderWidth: 3
      }, {
        label: 'Campaign End',
        data: end,
        borderColor: '#1D4ED8',
        tension: 0.3,
        backgroundColor: '#1D4ED8',
        borderWidth: 3
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its parent container
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? "white" : "gray"
        }
      },
      title: {
        display: true,
        text: 'Campaign Start and End',
        color: isDarkMode ? "white" : "gray"
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "white" : "gray",
        },
        grid: {
          color: isDarkMode ? "white" : "gray",
        }
      },
      y: {
        ticks: {
          color: isDarkMode ? "white" : "gray",
        },
        grid: {
          color: isDarkMode ? "white" : "gray",
        }
      }
    }
  };

  const downloadChart = () => {
    const chart = chartRef.current;
    const link = document.createElement('a');
    link.href = chart.toBase64Image();
    link.download = 'campaign-report.png';
    link.click();
  };

  return (
    <div className="relative w-full h-96"> {/* Parent container with a fixed height */}
      <Line ref={chartRef} data={data} options={options} />
      <div
        className="absolute top-7 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={downloadChart}
      >
        <FaDownload className={`${isDarkMode ? "text-white" : "text-gray-500"} text-lg`}/>
      </div>
    </div>
  );
};

export default ChartTwo;
