'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react'

const ClientTable = () => {
    const [tableData, setTableData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');    
    const [searchTerm, setSearchTerm] = useState('');
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 947);
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${umaxUrl}/client-by-tenant`, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTableData(response.data.Data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = tableData.filter((data) => {
        return (
            (!selectedStatus || data.status === Number(selectedStatus)) &&
            (!searchTerm || data.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const checkDeviceWidth = () => {
        setIsWideScreen(window.innerWidth >= 760);
    };

    useEffect(() => {
        window.addEventListener("resize", checkDeviceWidth);
        return () => window.removeEventListener("resize", checkDeviceWidth);
    }, []);

  return (
    <>
        <div className='font-semibold text-3xl text-slate-800 mb-10'>
            <h1>Clients</h1>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg w-full h-fit p-5">
                <div className={`flex ${isWideScreen ? "flex-row" : "flex-col"}`}>
                    <div className={`mb-4 flex flex-row items-start gap-4`}>
                        {/* {'Filter starts here'} */}
                            <input
                                className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/2'} border-gray-300 rounded-lg px-2 text-[15px] text-semibold py-2`}
                                // style={{ width: "200px" }}
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <select name="" className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/2'} border-gray-300 rounded-lg px-2 md:text-[15px] text-[12px] text-semibold py-2`} value={selectedStatus} onChange={handleStatusChange} id="">
                                <option value="">Status</option>
                                <option value="1">Active</option>
                                <option value="2">Deactive</option>
                            </select>
                        {/* {'Filter ends here'} */}
                    </div>
                    <div className="w-full flex gap-3 justify-end pb-5">
                        <button className="float-right border border-gray-300 rounded-lg px-5 py-2 text-end">+ Add</button>
                        <button className="float-right border border-gray-300 rounded-lg px-4 py-2" >
                            {/* <RiFileExcel2Line className="relative font-medium text-lg" /> */}
                        </button>
                        <button className="float-right border border-gray-300 rounded-lg px-4 py-2">
                            {/* <AiOutlineFilePdf className="relative font-medium text-lg" /> */}
                        </button>
                    </div>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full border'>
                        <thead className='bg-white'>
                            <tr className='text-left'>
                                <th className='px-4 py-2 border'>Name</th>
                                <th className='px-4 py-2 border'>Address</th>
                                <th className='px-4 py-2 border'>Contact</th>
                                <th className='px-4 py-2 border'>Email</th>
                                <th className='px-4 py-2 border'>Status</th>
                                <th className='px-4 py-2 border'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((data, index) => (
                                <tr key={index} className='text-center'>
                                    <td className='px-4 py-2 border'>{data.name}</td>
                                    <td className='px-4 py-2 border'>{data.address}</td>
                                    <td className='px-4 py-2 border'>{data.contact}</td>
                                    <td className='px-4 py-2 border'>{data.email}</td>
                                    <td className='px-4 py-2 border'>{data.status === 1 ? 'Active' : 'Deactive'}</td>
                                    <td className='px-4 py-2 border flex gap-1'>
                                        <button className='bg-blue-500 text-white px-4 py-2 rounded me-1'>Edit</button>
                                        <button className='bg-red-500 text-white px-4 py-2 rounded'>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    </>
  )
}

export default ClientTable