'use client'
import * as React from "react";
import WorldMap from "react-svg-worldmap";
import { useContext } from "react";
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page";
import { useTranslations } from "next-intl";
import { useState,useEffect } from "react";
import axios from "axios";
function Map() {

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

    const [data,setData] = useState([]);

    async function getChartData() { 
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chart-data`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      const data = res.data.Output
      const transformedData = Object.keys(data.map).map(key => ({
        country: key,    // Kunci sebagai kode negara
        value: data.map[key], // Nilai sebagai jumlah klien
      }));

      setData(transformedData);
    }  

    useEffect(() => {
      getChartData()
    }, [])
    
  return (
    <div className="App overflow-auto">
      <p className={`${isDarkMode ? "text-white" : "text-gray-500"}`}>Client Country</p>
      <WorldMap
        color={isDarkMode ?  "#D1D5DB" : "#1E40AF" }
        backgroundColor={isDarkMode ? "#1E293B" : "#FFFFFF"}
        value-suffix="Client"
        strokeOpacity={0.5}
        borderColor={isDarkMode ?  "#D1D5DB" : "#1E40AF" }
        size="responsive"
        data={data}
      />
    </div>
  );
}

export default Map;