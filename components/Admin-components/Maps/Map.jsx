import React, { useState,useEffect } from 'react'
import WorldMap from "react-svg-worldmap";
import { useContext } from 'react';
import { AdminDashboardContext } from '@/app/[locale]/admin-dashboard/page';
import axios from 'axios';

const Map = () => {
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

    const [client, setClient] = useState([])

    async function getClient() { 
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-by-tenant`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      const data = res.data.Data
      setClient(data)
    }  

    useEffect(() => {
      getClient()
    }, [])

    useEffect(() => {
      console.log(client)
    }, [client])

  const data = [
    { country: "cn", value: 0 }, // china
    { country: "in", value: 0 }, // india
    { country: "id", value: 15 }, // indonesia
    { country: "us", value: 0 }, // united states
    { country: "pk", value: 0 }, // pakistan
    { country: "br", value: 0 }, // brazil
    { country: "ng", value: 0 }, // nigeria
    { country: "bd", value: 0 }, // bangladesh
    { country: "ru", value: 0 }, // russia
    { country: "mx", value: 0 }, // mexico
    { country: "ca", value: 0 }, // canada
    { country: "au", value: 0 }, // australia
    { country: "uk", value: 0 }, // united kingdom
    { country: "fr", value: 0 }, // france
    { country: "de", value: 0 }, // germany
    { country: "jp", value: 0 }, // japan
    { country: "it", value: 0 }, // italy
    { country: "es", value: 0 }, // spain
    { country: "kr", value: 0 }, // south korea
    { country: "sa", value: 0 }, // saudi arabia
  ];


  return (
    <>
      <div className='text-black dark:text-white'>Clients Country</div>
      <div className="App flex justify-center overflow-auto w-full h-[370px]  ">
        <WorldMap className="transition-transform"
          multiple={true}
          color={isDarkMode ? "#ffffff" : "#3C50E0" }
          backgroundColor={isDarkMode ? "#1E293B" : "#ffffff"}
          value-suffix="people"
          size="xl"
          data={data}
        />
      </div>
    </>
  )
}

export default Map