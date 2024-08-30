"use client";

import React, { useContext, useState, useEffect, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page";

// Dynamically import ApexCharts to ensure it works with Next.js
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const ChartTwo = ({ chartData }) => {
  const t = useTranslations("admin-dashboard");
  const { isDarkMode } = useContext(AdminDashboardContext);

  const [start, setStart] = useState([]);
  const [end, setEnd] = useState([]);

  useEffect(() => {
    if (chartData) {
      setStart(chartData.line_start || []);
      setEnd(chartData.line_end || []);
    }
  }, [chartData]);

  const series = useMemo(() => [
    {
      name: "Campaign Start",
      data: start,
    },
    {
      name: "Campaign End",
      data: end,
    },
  ], [start, end]);

  const options = useMemo(() => ({
    chart: {
      type: "area",
      background: isDarkMode ? "#1E293B" : "#fff",
      foreColor: isDarkMode ? "#fff" : "#1E293B",
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
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
  },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
      type: "solid",
      opacity: 0.2,
    },
    colors: ["#60A5FA", "#1D4ED8"],
    tooltip: {
      theme: isDarkMode ? "dark" : "light",
    },
    legend: {
      labels: {
        colors: isDarkMode ? '#fff' : '#333',
      },
      position: "top",
    },
    title: {
      text: "Campaign start and end date",
      align: "left",
      style: {
        color: isDarkMode ? "white" : "gray",
        fontSize: '18px',
      },
      margin: 50,
    },
  }), [isDarkMode]);

  return (
    <div className="relative w-full h-96">
      <ApexCharts options={options} series={series} type="area" height="100%" />
    </div>
  );
};

export default memo(ChartTwo);
