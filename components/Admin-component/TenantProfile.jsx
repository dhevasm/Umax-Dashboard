'use client'

import { useState, useEffect, useRef } from "react"
import { IconContext } from "react-icons"
import axios from "axios"
import { FaBuilding, FaDollarSign, FaDolly, FaEnvelope, FaFlag, FaHome, FaPhone } from "react-icons/fa"

export default function TenantProfile({tenant_id}){

    const [tenant, setTenant] = useState([])

    async function getTenant(){
        const response = await axios.get(`https://umaxxnew-1-d6861606.deta.app/tenant-by-id?tenant_id=${tenant_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
            }
        }).then((response) => {
            setTenant(response.data.Data[0])
        })
    }

    useEffect(() => {
        getTenant()
    }, [])

    // useEffect(() => {
    //     console.log(tenant)
    // }, [tenant])

    return (
        <>
        <div className="w-full h-0.5 bg-gray-400 my-5"></div>
            <div className="w-full h-full">
                <h1 className="text-3xl  m-3">Tenant Profile</h1>
                <div className="rouneded-lg shadow-xl">
                    <div className="w-full h-20 bg-gray-400 flex items-end px-5 py-3 rounded-t-md">
                        {
                            tenant.company ? (
                                <h1 className="font-bold text-2xl text-white drop-shadow-xl">{tenant.company}</h1>
                            ) : "Loading ..."
                        }
                    </div>
                    <div className="p-5">
                        {
                            tenant.address ? (
                                <>
                                    <div className="flex fllex-col md:flex-row gap-2 items-start mt-3"> <FaBuilding className="text-xl"/> 
                                       <p>Address : {tenant.address}</p> 
                                     </div>
                                     <div className="w-full h-0.5 my-10 bg-gray-300"></div>
                                    <div className="flex flex-col md:flex-row gap-5 md:gap-10 mt-5">
                                        <div className="flex gap-2 items-center"> <FaPhone/> 
                                            <div>
                                                Contact <a href={`tel:${tenant.contact}`} className="text-blue-500">{tenant.contact}</a>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center"> <FaEnvelope/>
                                            <div>
                                                Email :  <a href={`mailto:${tenant.email}`} className="text-blue-500"> {tenant.email} </a> 
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-0.5 my-10 bg-gray-300"></div>
                                    <div className="flex flex-col md:flex-row gap-5 md:gap-10 mt-5 pb-5">
                                        <div className="flex gap-2 items-center"> <FaHome/> 
                                            <p>
                                                Culture : {tenant.culture}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 items-center"> <FaFlag/>
                                            <p>
                                                Language :  {tenant.language}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 items-center"> <FaDollarSign/>
                                            <p>
                                                Currency :  {tenant.currency}
                                            </p>
                                        </div>
                                    </div>
                                    
                                </>
                            ) : "Loading ..."
                        }
                    
                    </div>
                </div>             

            </div>
        </>
    )
}