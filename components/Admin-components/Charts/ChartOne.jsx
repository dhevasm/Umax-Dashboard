"use client";

import React, { useState, useEffect } from 'react'
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors } from 'chart.js';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';
import { AdminDashboardContext } from '@/app/[locale]/admin-dashboard/page';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartOne = () => {
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

    async function getChartData() { 
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chart-data`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      const data = res.data.Output
      setAwareness(data.bar)
      setConversion(data.bar2)
      setConsideration(data.bar3)
      // console.log(data)
    }  

    useEffect(() => {
      getChartData()
    }, [])

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
      <Bar data={data} options={options} height={400}/>
);
    

}

 
export default ChartOne;