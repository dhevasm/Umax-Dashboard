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

    let dataDefault =[
      { country: "cn", value: 0, name:"China" }, 
      { country: "af", value: 0, name:"Afghanistan"}, 
      { country: "am", value: 0, name:"Armenia"}, 
      // asean
      { country: "id", value: 0, name:"Indonesia" }, 
      { country: "sg", value: 0, name:"Singapore" }, 
      { country: "in", value: 0, name:"India" }, 
      { country: "gb", value: 0, name:"United kingdom" }, 
      { country: "us", value: 0, name:"United states" }, 
      { country: "pk", value: 0, name:"Pakistan" }, 
      { country: "br", value: 0, name:"Brazil" }, 
      { country: "ng", value: 0, name:"Nigeria" }, 
      { country: "bd", value: 0, name:"Bangladesh" }, 
      { country: "ru", value: 0, name:"Russia" }, 
      { country: "mx", value: 0, name:"Mexico" }, 
      { country: "ca", value: 0, name:"Canada" }, 
      { country: "au", value: 0, name:"Australia" }, 
      { country: "fr", value: 0, name:"France" }, 
      { country: "de", value: 0, name:"Germany" }, 
      { country: "jp", value: 0, name:"Japan" }, 
      { country: "it", value: 0, name:"Italy" }, 
      { country: "es", value: 0, name:"Spain" }, 
      { country: "kr", value: 0, name:"South Korea" }, 
      { country: "sa", value: 0, name:"Saudi Arabia" }, 
    ]

    const [data, setData] = useState([])

     useEffect(() => {
      getClientCount()
    } , [client])

    const getClientCount = () => {
      client.map((item) => {
        const country = item.address.split(",")[item.address.split(",").length - 1]
        const foundCountry = dataDefault.findIndex(obj => obj.name === country.split(" ")[1])
        if (foundCountry !== -1) {
          dataDefault[foundCountry].value++
          
        }
        // console.log(foundCountry)
      });
      // console.log(data);
      setData(dataDefault)
    }

    return (
      <>
        <div className='text-black dark:text-white'>Clients Country</div>
        <div className="App flex justify-center overflow-auto w-full h-[370px]  ">
          {
            data.length != 0 ? <WorldMap className="transition-transform"
            multiple={true}
            color={isDarkMode ? "#ffffff" : "#3C50E0" }
            backgroundColor={isDarkMode ? "#1E293B" : "#ffffff"}
            value-suffix="people"
            size="xl"
            data={data}
          /> :  <WorldMap className="transition-transform"
          multiple={true}
          color={isDarkMode ? "#ffffff" : "#3C50E0" }
          backgroundColor={isDarkMode ? "#1E293B" : "#ffffff"}
          value-suffix="people"
          size="xl"
          data={dataDefault}/>
          }
          
        </div>
      </>
    )
}

export default Map