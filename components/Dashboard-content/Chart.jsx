import axios from "axios";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ApexChart from "react-apexcharts";

const Chart = ({ campaignID, time }) => {
    const [selected, setSelected] = useState("week");
    const [data, setData] = useState([]);
    const umaxUrl = "https://umaxxnew-1-d6861606.deta.app";
    let chartUrl = "";
    let category = [];
    const t = useTranslations();

    useEffect(() => {
        setSelected(time);
    }, [time]);

    useEffect(() => {
        const getMetricByCampaign = async () => {
        if (!campaignID) {
            console.warn("No campaign ID provided");
            return;
        }

        try {
            const token = localStorage.getItem("jwtToken");
            if (selected === "week") {
            chartUrl = `${umaxUrl}/last-week?campaign_id=${campaignID}&tenantId=${localStorage.getItem(
                "tenantId"
            )}`;
            } else if (selected === "month") {
            chartUrl = `${umaxUrl}/last-month?campaign_id=${campaignID}&tenantId=${localStorage.getItem(
                "tenantId"
            )}`;
            } else {
            chartUrl = `${umaxUrl}/last-year?campaign_id=${campaignID}&tenantId=${localStorage.getItem(
                "tenantId"
            )}`;
            }
            const response = await axios.get(chartUrl, {
            headers: {
                "accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${token}`,
            },
            });
            setData(response.data.Data);
            category = selected === "year" ? data.map((item) => item.month) : data.map((_, index) => index + 1);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
        };
        getMetricByCampaign();
    }, [selected, campaignID]);

    const Data = {
        series: [
        {
            name: t("metric7.amount-spent"),
            data: data.map((obj) => parseFloat(obj.amountspent.replace(/[^0-9.]/g, ""))),
        },
        {
            name: t("metric7.reach-amount-spent-ratio"),
            data: data.map((obj) => parseFloat(obj.rar.replace(/[^0-9.]/g, ""))),
        },
        {
            name: t("metric7.ctr"),
            data: data.map((obj) => parseFloat(obj.ctr.replace(/[^0-9.]/g, ""))),
        },
        ],
        categories: category,
    };

    const options = {
        chart: {
        type: "area",
        height: 500,
        },
        dataLabels: {
        enabled: false,
        },
        stroke: {
        curve: "smooth",
        },
        xaxis: {
        categories: Data.categories,
        labels: {
            style: {
                colors: '#64748b',
            },
        },
        },
        yaxis: {
        labels: {
            style: {
                colors: '#64748b',
            },
        },
        },
        colors: ["#FF5733", "#33FF57", "#3357FF", "#F39C12"],
    };

    return (
        <div>
            {campaignID != '' ? 
            <div id="chart">
                <ApexChart options={options} series={Data.series} type="area" height={350} />
            </div>
            :
            <div className="w-full h-full flex justify-center items-center pb-10">
                <Image src="/assets/NotFound.png" className="animate-pulse" width={320} height={320} alt="Campaign Not Selected"/>
            </div>
            }

        </div>
    );
};

export default Chart;

