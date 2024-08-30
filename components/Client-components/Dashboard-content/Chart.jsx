import axios from "axios";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ApexChart from "react-apexcharts";

const Chart = ({ campaignID, time }) => {
    const [selected, setSelected] = useState("week");
    const [data, setData] = useState([]);
    const umaxUrl = process.env.NEXT_PUBLIC_API_URL;
    let chartUrl = "";
    const [category, setCategory] = useState([]);
    const t = useTranslations();

    useEffect(() => {
        setSelected(time);
    }, [time]);

    useEffect(() => {
        const formatDate = (date) => {
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            });
        };

        const generateCategories = () => {
            const categories = [];
            const currentDate = new Date();

            if (selected === "week") {
                for (let i = 0; i < 7; i++) {
                    const newDate = new Date(currentDate);
                    newDate.setDate(currentDate.getDate() - i);
                    categories.push(formatDate(newDate));
                }
            } else if (selected === "month") {
                for (let i = 0; i < 30; i++) {
                    const newDate = new Date(currentDate);
                    newDate.setDate(currentDate.getDate() - i);
                    categories.push(formatDate(newDate));
                }
            } else if (selected === "year") {
                for (let i = 0; i < 12; i++) {
                    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
                    categories.push(formatDate(newDate));
                }
                categories.reverse(); // Untuk mengurutkan dari Januari hingga Desember
            }

            setCategory(categories.reverse()); // Membalik urutan agar dari tanggal awal sampai akhir
        };

        generateCategories();

        const getMetricByCampaign = async () => {
            if (!campaignID) {
                return;
            }

            try {
                const token = localStorage.getItem("jwtToken");
                if (selected === "week") {
                    chartUrl = `${umaxUrl}/last-week?campaign_id=${campaignID}&tenantId=${localStorage.getItem("tenantId")}`;
                } else if (selected === "month") {
                    chartUrl = `${umaxUrl}/last-month?campaign_id=${campaignID}&tenantId=${localStorage.getItem("tenantId")}`;
                } else {
                    chartUrl = `${umaxUrl}/last-year?campaign_id=${campaignID}&tenantId=${localStorage.getItem("tenantId")}`;
                }
                const response = await axios.get(chartUrl, {
                    headers: {
                        "accept": "application/json",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setData(response.data.Data);
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
                data: data.map((obj) => (parseFloat(obj.amountspent.replace(/[^0-9.]/g, "")))).reverse(),
            },
            {
                name: t("metric7.reach-amount-spent-ratio"),
                data: data.map((obj) => ((parseFloat(obj.rar.replace(/[^0-9.]/g, "")) / 100 * parseFloat(obj.amountspent.replace(/[^0-9.]/g, "")))).toFixed(2)).reverse(),
            },
            {
                name: t("metric7.ctr"),
                data: data.map((obj) => ((parseFloat(obj.ctr.replace(/[^0-9.]/g, "")) / 100 * parseFloat(obj.amountspent.replace(/[^0-9.]/g, "")))).toFixed(2)).reverse(),
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
            categories: category,
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
        legend: {
            labels: {
                colors: '#64748b',
            },
        },
        colors: ["#FF5733", "#33FF57", "#3357FF", "#F39C12"],
        markers: {
            colors: ["#FF5733", "#33FF57", "#3357FF"], // Customize marker colors based on series
        },
    };

    return (
        <div className="text-black">
            {campaignID ? (
                data.length > 0 ? (
                    <div id="chart">
                        <ApexChart options={options} series={Data.series} type="area" height={350} />
                    </div>
                ) : (
                    <div className="w-full h-full flex justify-center items-center pb-10">
                        <Image src="/assets/NotFound.png" className="animate-pulse" width={320} height={320} priority alt="No Data Available"/>
                    </div>
                )
            ) : (
                <div className="w-full h-full flex justify-center items-center pb-10">
                    <Image src="/assets/NotFound.png" className="animate-pulse" width={320} height={320} priority alt="Campaign Not Selected"/>
                </div>
            )}
        </div>
    );
};

export default Chart;
