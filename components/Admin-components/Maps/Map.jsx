'use client'
import React, { useState, useEffect, useContext } from 'react';
import WorldMap from "react-svg-worldmap";
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { AdminDashboardContext } from '@/app/[locale]/admin-dashboard/page';

const Map = () => {
  const { isDarkMode } = useContext(AdminDashboardContext);
  const [client, setClient] = useState([]);
  const [data, setData] = useState([]);
  const t = useTranslations("admin-dashboard");

  // Fetch client data from API
  async function getClient() { 
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-by-tenant`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      const data = res.data.Data;
      setClient(data);
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  }  

  useEffect(() => {
    getClient();
  }, []);

  // Default data for the map
  const dataDefault = [
    { country: "cn", value: 0, name: "China" },
    { country: "af", value: 0, name: "Afghanistan" },
    { country: "am", value: 0, name: "Armenia" },
    { country: "id", value: 0, name: "Indonesia" },
    { country: "sg", value: 0, name: "Singapore" },
    { country: "in", value: 0, name: "India" },
    { country: "gb", value: 0, name: "United Kingdom" },
    { country: "us", value: 0, name: "United States" },
    { country: "pk", value: 0, name: "Pakistan" },
    { country: "br", value: 0, name: "Brazil" },
    { country: "ng", value: 0, name: "Nigeria" },
    { country: "bd", value: 0, name: "Bangladesh" },
    { country: "ru", value: 0, name: "Russia" },
    { country: "mx", value: 0, name: "Mexico" },
    { country: "ca", value: 0, name: "Canada" },
    { country: "au", value: 0, name: "Australia" },
    { country: "fr", value: 0, name: "France" },
    { country: "de", value: 0, name: "Germany" },
    { country: "jp", value: 0, name: "Japan" },
    { country: "it", value: 0, name: "Italy" },
    { country: "es", value: 0, name: "Spain" },
    { country: "kr", value: 0, name: "South Korea" },
    { country: "sa", value: 0, name: "Saudi Arabia" },
  ];

  // Process client data to update map
  useEffect(() => {
    const processedData = [...dataDefault];
    
    client.forEach(item => {
      const country = item.address.split(",").pop().trim();
      const foundIndex = processedData.findIndex(obj => obj.name === country);
      if (foundIndex !== -1) {
        processedData[foundIndex].value++;
      }
    });

    setData(processedData);
  }, [client]);

  return (
    <>
      <div className='text-black font-semibold text-xl dark:text-white'>{t('clients-country')}</div>
      <div className="App flex justify-center overflow-auto w-full h-[370px]">
        <WorldMap
          className="transition-transform"
          multiple={true}
          color={isDarkMode ? "#ffffff" : "#3C50E0"}
          backgroundColor={isDarkMode ? "#1E293B" : "#ffffff"}
          value-suffix="people"
          size="xl"
          data={data.length ? data : dataDefault}
        />
      </div>
    </>
  );
};

export default Map;
