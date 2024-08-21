'use client'
import * as React from "react";
import WorldMap from "react-svg-worldmap";
import { useContext } from "react";
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page";
import { useTranslations } from "next-intl";
import { useState,useEffect } from "react";
import axios from "axios";
import { FaMinus, FaPlus } from "react-icons/fa";
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

    const size = ["lg", "xxl"];
    const [mapDisplay, setMapDisplay] = useState(0);

    const handleZoomin = () => {
      if(mapDisplay < size.length - 1){
        setMapDisplay(mapDisplay + 1)
      }
    }

    const handleZoomout = () => {
      if(mapDisplay > 0){
        setMapDisplay(mapDisplay -1)
    }
  }
  return (
    <div className="flex flex-col items-center overflow-auto  h-full w-full">
    <div className="App">
      {/* <p className={`${isDarkMode ? "text-white" : "text-gray-500"}`}>Client Country</p> */}
      <WorldMap
        color={isDarkMode ?  "#D1D5DB" : "#1E40AF" }
        backgroundColor={isDarkMode ? "#1E293B" : "#FFFFFF"}
        value-suffix="Client"
        strokeOpacity={1}
        borderColor={isDarkMode ?  "#D1D5DB" : "#1E40AF" }
        size={size[mapDisplay]}
        data={data}
      />
    </div>
    <div className="flex absolute bottom-7 gap-3 self-end pe-5">
        <button onClick={handleZoomout}  className={`p-3 rounded-full border-2 ${
            isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-gray-200 border-gray-400 text-black"
          } hover:bg-opacity-80 transition-colors duration-300`}><FaMinus/></button>
        <button onClick={handleZoomin}  className={`p-3 rounded-full border-2 ${
            isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-gray-200 border-gray-400 text-black"
          } hover:bg-opacity-80 transition-colors duration-300`}><FaPlus/></button>
      </div>
    </div>
  );
}

export default Map;