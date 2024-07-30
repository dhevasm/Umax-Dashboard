"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useContext } from "react";
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page";
import { useState,useEffect } from "react";
import axios from "axios";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartTwo = () => {
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
  
    const options = {

      legend: {
        show: false,
        position: "top",
        horizontalAlign: "left",
      },
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
        toolbar: {
          show: false,
        },
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            chart: {
              height: 300,
            },
          },
        },
        {
          breakpoint: 1366,
          options: {
            chart: {
              height: 350,
            },
          },
        },
      ],
      stroke: {
        width: [2, 2],
        curve: "straight",
      },
      grid: {
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 4,
        colors: "#fff",
        strokeColors: ["#3056D3", "#80CAEE"],
        strokeWidth: 3,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        hover: {
          size: undefined,
          sizeOffset: 5,
        },
      },
      xaxis: {
        type: "category",
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        title: {
          style: {
            fontSize: "0px",
          },
        },
        min: 0,
      },
    };

    const [campaigns, setCampaigns] = useState([])

    const [filteredCampaign, setFilteredCampaign] = useState({
      "jan": 0,
      "feb": 0,
      "mar": 0,
      "apr": 0,
      "may": 0,
      "jun": 0,
      "jul": 0,
      "aug": 0,
      "sep": 0,
      "oct": 0,
      "nov": 0,
      "dec": 0
    })
    const [filteredCampaignDone, setFilteredCampaignDone] = useState({
      "jan": 0,
      "feb": 0,
      "mar": 0,
      "apr": 0,
      "may": 0,
      "jun": 0,
      "jul": 0,
      "aug": 0,
      "sep": 0,
      "oct": 0,
      "nov": 0,
      "dec": 0
    })

    async function getCampaigns() { 
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaign-by-tenant`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      const data = res.data.Data
      setCampaigns(data)
    }  

    useEffect(() => {
      getCampaigns()
    }, [])
    
    const Year = new Date().getFullYear();

    async function getCountData(){
      
      const today = new Date().getDate();
      const jan = campaigns.filter(campaign => campaign.start_date.includes("Jan") && campaign.start_date.includes(Year)).length
      const feb = campaigns.filter(campaign => campaign.start_date.includes("Feb") && campaign.start_date.includes(Year)).length
      const mar = campaigns.filter(campaign => campaign.start_date.includes("Mar") && campaign.start_date.includes(Year)).length
      const apr = campaigns.filter(campaign => campaign.start_date.includes("Apr") && campaign.start_date.includes(Year)).length
      const may = campaigns.filter(campaign => campaign.start_date.includes("May") && campaign.start_date.includes(Year)).length
      const jun = campaigns.filter(campaign => campaign.start_date.includes("Jun") && campaign.start_date.includes(Year)).length
      const jul = campaigns.filter(campaign => campaign.start_date.includes("Jul") && campaign.start_date.includes(Year)).length
      const aug = campaigns.filter(campaign => campaign.start_date.includes("Aug") && campaign.start_date.includes(Year)).length
      const sep = campaigns.filter(campaign => campaign.start_date.includes("Sep") && campaign.start_date.includes(Year)).length
      const okt = campaigns.filter(campaign => campaign.start_date.includes("Okt") && campaign.start_date.includes(Year)).length
      const nov = campaigns.filter(campaign => campaign.start_date.includes("Nov") && campaign.start_date.includes(Year)).length
      const des = campaigns.filter(campaign => campaign.start_date.includes("Des") && campaign.start_date.includes(Year)).length
      
      const janDone = campaigns.filter(campaign => campaign.end_date.includes("Jan") && campaign.end_date.includes(Year)).length
      const febDone = campaigns.filter(campaign => campaign.end_date.includes("Feb") && campaign.end_date.includes(Year)).length
      const marDone = campaigns.filter(campaign => campaign.end_date.includes("Mar") && campaign.end_date.includes(Year)).length
      const aprDone = campaigns.filter(campaign => campaign.end_date.includes("Apr") && campaign.end_date.includes(Year)).length
      const mayDone = campaigns.filter(campaign => campaign.end_date.includes("May") && campaign.end_date.includes(Year)).length
      const junDone = campaigns.filter(campaign => campaign.end_date.includes("Jun") && campaign.end_date.includes(Year)).length
      const julDone = campaigns.filter(campaign => campaign.end_date.includes("Jul") && campaign.end_date.includes(Year)).length
      const augDone = campaigns.filter(campaign => campaign.end_date.includes("Aug") && campaign.end_date.includes(Year)).length
      const sepDone = campaigns.filter(campaign => campaign.end_date.includes("Sep") && campaign.end_date.includes(Year)).length
      const oktDone = campaigns.filter(campaign => campaign.end_date.includes("Okt") && campaign.end_date.includes(Year)).length
      const novDone = campaigns.filter(campaign => campaign.end_date.includes("Nov") && campaign.end_date.includes(Year)).length
      const desDone = campaigns.filter(campaign => campaign.end_date.includes("Des") && campaign.end_date.includes(Year)).length

      setFilteredCampaignDone({
        "jan": janDone,
        "feb": febDone,
        "mar": marDone,
        "apr": aprDone,
        "may": mayDone,
        "jun": junDone,
        "jul": julDone,
        "aug": augDone,
        "sep": sepDone,
        "okt": oktDone,
        "nov": novDone,
        "des": desDone
      })

      setFilteredCampaign({
        "jan": jan,
        "feb": feb,
        "mar": mar,
        "apr": apr,
        "may": may,
        "jun": jun,
        "jul": jul,
        "aug": aug,
        "sep": sep,
        "okt": okt,
        "nov": nov,
        "des": des
      })
    }

    useEffect(() => {
      getCountData()
    }, [campaigns])


  const series = [
    {
      name: "Campaign Start",
      data: [
        filteredCampaign.jan,
        filteredCampaign.feb,
        filteredCampaign.mar,
        filteredCampaign.apr,
        filteredCampaign.may,
        filteredCampaign.jun,
        filteredCampaign.jul,
        filteredCampaign.aug,
        filteredCampaign.sep,
        filteredCampaign.okt,
        filteredCampaign.nov,
        filteredCampaign.des,
      ],
    },
    {
      name: "Campaign End",
      data: [
        filteredCampaignDone.jan,
        filteredCampaignDone.feb,
        filteredCampaignDone.mar,
        filteredCampaignDone.apr,
        filteredCampaignDone.may,
        filteredCampaignDone.jun,
        filteredCampaignDone.jul,
        filteredCampaignDone.aug,
        filteredCampaignDone.sep,
        filteredCampaignDone.okt,
        filteredCampaignDone.nov,
        filteredCampaignDone.des,
      ],
    },
  ];

  return (
    <div className="col-span-12 rounded-sm bg-white dark:bg-slate-800 dark:text-white px-5 pb-5 pt-7.5 shadow-default">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-col md:flex-row gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary text-sm md:text-md">Campaign Start</p>
              <p className="text-xs md:text-sm text-nowrap font-medium">{`01.01.${Year} - 31.12.${Year}`}</p>
            </div>
          </div>  
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary text-sm md:text-md">Campaign End</p>
              <p className="text-xs md:text-sm text-nowrap font-medium">{`01.01.${Year} - 31.12.${Year}`}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          {/* <div className="inline-flex items-center rounded-md bg-slate-50  p-1.5">
            <button className="rounded bg-white px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card">
              Day
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card">
              Week
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card">
              Month
            </button>
          </div> */}
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
