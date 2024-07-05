'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react'

const AccountTable = () => {
    const [tableData, setTableData] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 760);
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${umaxUrl}/account-by-tenant`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTableData(response.data.Data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    
    const handlePlatformChange = (event) => {
        setSelectedPlatform(event.target.value);
    }

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const filteredData = tableData.filter((data) => {
        return (
            (!selectedPlatform || data.platform === Number(selectedPlatform)) &&
            (!selectedStatus || data.status === Number(selectedStatus)) &&
            (!searchTerm || data.username.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <h1>Account</h1>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg w-full h-fit p-5">
            <div className={`mb-4 flex ${isWideScreen ? "flex-row" : "flex-col"} items-start gap-4`}>
                {/* {'Filter Starts Here'} */}
                <div>
                    <input className="border border-gray-300 rounded-lg px-4 py-2" style={{width: '200px'}} type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
                </div>
                <div className='flex gap-4'>
                    <select name="" className="border border-gray-300 rounded-lg px-4 py-2" style={{width: '200px'}} id="" onChange={handlePlatformChange}>
                        <option value="">Platform</option>
                        <option value="1">Meta Ads</option>
                        <option value="2">Google Ads</option>
                        <option value="3">Tiktok Ads</option>
                    </select>
                    <select name="" className="border border-gray-300 rounded-lg px-4 py-2" style={{width: '200px'}} id="" onChange={handleStatusChange}>
                        <option value="">Status</option>
                        <option value="1">Active</option>
                        <option value="2">Deactive Ads</option>
                    </select>
                </div>
                {/* {'Filter Ends Here'} */}
            </div>
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                    <thead className='bg-white'>
                        <tr className='text-left'>
                            <th className='px-4 py-2 border'>Name</th>
                            <th className='px-4 py-2 border'>Client</th>
                            <th className='px-4 py-2 border'>Platform</th>
                            <th className='px-4 py-2 border'>Email</th>
                            <th className='px-4 py-2 border'>Status</th>
                            <th className='px-4 py-2 border'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((data, index) => (
                            <tr key={index} className='border text-center'>
                                <td className='px-4 py-2 border text-nowrap'>{data.username}</td>
                                <td className='px-4 py-2 border text-nowrap'>{data.client_name}</td>
                                <td className='px-4 py-2 border text-nowrap'>{data.platform === 1 ? 'Meta Ads' : data.platform === 2 ? 'Google Ads' : 'Tiktok Ads'}</td>
                                <td className='px-4 py-2 border text-nowrap'>{data.email}</td>
                                <td className='px-4 py-2 border text-nowrap'>{data.status === 1 ? 'Active' : 'Deactive'}</td>
                                <td className='px-4 py-2 border text-nowrap'>
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

export default AccountTable