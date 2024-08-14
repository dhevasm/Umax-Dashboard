"use client";

import React, { useState, useEffect } from 'react'
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors } from 'chart.js';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';
import { AdminDashboardContext } from '@/app/[locale]/admin-dashboard/page';
import { Filler } from 'chart.js';

ChartJS.register(Filler ,CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartOne = ({chartData}) => {
  const t = useTranslations("admin-dashboard");
  const {sidebarHide,
    setSidebarHide,
    updateCard,
    setUpdateCard,
    changeTable,
    setChangeTable,
    userData,
    dataDashboard,
    isDarkMode,
    setIsDarkMode} = useContext(AdminDashboardContext)

  const [awareness, setAwareness] = useState(0);
  const [conversion, setConversion] = useState(0);
  const [consideration, setConsideration] = useState(0);

    useEffect(() => {
      setAwareness(chartData.bar)
      setConversion(chartData.bar2)
      setConsideration(chartData.bar3)
    }, [chartData])


    const data = {
      labels: ["awareness", "conversion", "consideration"],
      datasets: [
          {
              label: 'Campaign',
              data: [awareness, conversion, consideration],
              backgroundColor: '#1368DE',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              barThickness: 30,
          },
      ],
  };

  const options = {
    responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: isDarkMode ? "white" : "gray" // Change legend text color
                }
            },
            title: {
                display: true,
                text: 'Campaign Objective',
                color:  isDarkMode ? "white" : "gray" // Change title text color
            },
        },
        scales: {
            x: {
                ticks: {
                    color:  isDarkMode ? "white" : "gray", // Change x-axis labels color
                },
                grid: {
                    color:  isDarkMode ? "white" : "gray", // Optional: change grid line color
                }
            },
            y: {
                ticks: {
                    color:  isDarkMode ? "white" : "gray", // Change y-axis labels color
                },
                grid: {
                    color:  isDarkMode ? "white" : "gray", // Optional: change grid line color
                }
            }
        }
};

return (
    <Bar data={data} options={options} height={400} width={250}/>
);
    

}

 
export default ChartOne;