"use client";

import React, { useState, useEffect, useMemo, useContext } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useTranslations } from "next-intl";
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page";

// Dynamically import ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartTwo = () => {
  const t = useTranslations("admin-dashboard");
  const { isDarkMode } = useContext(AdminDashboardContext);

  // Initial state for campaigns
  const initialCampaignState = {
    jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
    jul: 0, aug: 0, sep: 0, okt: 0, nov: 0, des: 0
  };

  // State hooks
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaign, setFilteredCampaign] = useState(initialCampaignState);
  const [filteredCampaignDone, setFilteredCampaignDone] = useState(initialCampaignState);

  // Fetch campaigns data
  const getCampaigns = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaign-by-tenant`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setCampaigns(res.data.Data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    getCampaigns();
  }, []);

  // Calculate campaign data counts
  const getCountData = () => {
    const Year = new Date().getFullYear();

    const countData = (dateType) => {
      return (month) => campaigns.filter(campaign =>
        campaign[dateType].includes(month) && campaign[dateType].includes(Year)
      ).length;
    };

    setFilteredCampaignDone({
      jan: countData('end_date')('Jan'),
      feb: countData('end_date')('Feb'),
      mar: countData('end_date')('Mar'),
      apr: countData('end_date')('Apr'),
      may: countData('end_date')('May'),
      jun: countData('end_date')('Jun'),
      jul: countData('end_date')('Jul'),
      aug: countData('end_date')('Aug'),
      sep: countData('end_date')('Sep'),
      okt: countData('end_date')('Okt'),
      nov: countData('end_date')('Nov'),
      des: countData('end_date')('Des'),
    });

    setFilteredCampaign({
      jan: countData('start_date')('Jan'),
      feb: countData('start_date')('Feb'),
      mar: countData('start_date')('Mar'),
      apr: countData('start_date')('Apr'),
      may: countData('start_date')('May'),
      jun: countData('start_date')('Jun'),
      jul: countData('start_date')('Jul'),
      aug: countData('start_date')('Aug'),
      sep: countData('start_date')('Sep'),
      okt: countData('start_date')('Okt'),
      nov: countData('start_date')('Nov'),
      des: countData('start_date')('Des'),
    });
  };

  useEffect(() => {
    if (campaigns.length > 0) {
      getCountData();
    }
  }, [campaigns]);

  // Define chart options and series data
  const options = useMemo(() => ({
    legend: { show: false, position: "top", horizontalAlign: "left" },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      background: isDarkMode ? "#1E293B" : "#ffffff",
      foreColor: isDarkMode ? "#FFFFFF" : "#000000",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: { show: false },
    },
    responsive: [
      { breakpoint: 1024, options: { chart: { height: 300 } } },
      { breakpoint: 1366, options: { chart: { height: 350 } } },
    ],
    stroke: { width: [2, 2], curve: "straight" },
    grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      hover: { size: undefined, sizeOffset: 5 },
    },
    xaxis: {
      type: "category",
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { title: { style: { fontSize: "0px" } }, min: 0 },
  }), [isDarkMode]);

  const series = useMemo(() => [
    {
      name: t('campaign-start'),
      data: Object.values(filteredCampaign),
    },
    {
      name: t('campaign-end'),
      data: Object.values(filteredCampaignDone),
    },
  ], [filteredCampaign, filteredCampaignDone, t]);

  return (
    <div className="col-span-12 rounded-sm bg-white dark:bg-slate-800 dark:text-white px-5 pb-5 pt-7.5 shadow-default">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-col md:flex-row gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary text-sm md:text-md">{t('campaign-start')}</p>
              <p className="text-xs md:text-sm text-nowrap font-medium">{`01.01.${new Date().getFullYear()} - 31.12.${new Date().getFullYear()}`}</p>
            </div>
          </div>  
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary text-sm md:text-md">{t('campaign-end')}</p>
              <p className="text-xs md:text-sm text-nowrap font-medium">{`01.01.${new Date().getFullYear()} - 31.12.${new Date().getFullYear()}`}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          {/* Placeholder for any future controls */}
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5 text-black">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
