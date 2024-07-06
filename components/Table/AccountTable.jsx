'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiOutlineFilePdf } from 'react-icons/ai';
import { RiFileExcel2Line } from 'react-icons/ri';

const AccountTable = () => {
    const [tableData, setTableData] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isWideScreen, setIsWideScreen] = useState(false); // Set default to false
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
        setIsWideScreen(window.innerWidth >= 947);
    };

    useEffect(() => {
        // This effect will only run on the client side
        checkDeviceWidth();
        window.addEventListener("resize", checkDeviceWidth);
        return () => window.removeEventListener("resize", checkDeviceWidth);
    }, []);

    function StatusBadge({ status }) {
        let statusStyle = {}; // Objek gaya status

        switch (status) {
        case 1:
            statusStyle = {
            backgroundColor: "#DFFFDF",
            color: '#00A600',
            border: '0.3px solid #00CA00',
            padding: '5px 13px',
            fontSize: "12px",
            borderRadius: '6px',
            fontWeight: '500', 
            };
            return (
            <span style={statusStyle}>Active</span>
            );
        
        case 2:
            statusStyle = {
            backgroundColor: "#FFF2E8",
            color: '#D4380D', 
            border: '0.3px solid #FF0000',
            padding: '5px 15px',
            fontSize: "12px",
            borderRadius: '6px',
            fontWeight: '500', 
            };
            return (
            <span style={statusStyle}>Deactive</span>
            );
        default:
            return "Unknown";
        }
    }

    return (
        <>
            <div className='font-semibold text-3xl text-slate-800 mb-10'>
                <h1>Account</h1>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg w-full h-fit p-5">
                    <div className={`flex ${isWideScreen ? "flex-row" : "flex-col"}`}>
                        <div className={`mb-4 flex flex-row items-start gap-4`}>
                            {/* {'Filter starts here'} */}
                                <input
                                    className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 rounded-lg px-2 text-[15px] text-semibold py-2`}
                                    // style={{ width: "200px" }}
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <select name="" className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 rounded-lg px-2 md:text-[15px] text-[12px] text-semibold py-2`} id="" onChange={handlePlatformChange}>
                                    <option value="">Platform</option>
                                    <option value="1">Meta Ads</option>
                                    <option value="2">Google Ads</option>
                                    <option value="3">Tiktok Ads</option>
                                </select>
                                <select name="" className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 rounded-lg px-2 md:text-[15px] text-[12px] text-semibold py-2`} id="" onChange={handleStatusChange}>
                                    <option value="">Status</option>
                                    <option value="1">Active</option>
                                    <option value="2">Deactive Ads</option>
                                </select>
                            {/* {'Filter ends here'} */}
                        </div>
                        <div className="w-full flex gap-3 justify-end pb-5">
                            <button className="float-right border border-gray-300 rounded-lg px-5 py-2 text-end">+ Add</button>
                            <button className="float-right border border-gray-300 rounded-lg px-4 py-2" >
                                <RiFileExcel2Line className="relative font-medium text-lg" />
                            </button>
                            <button className="float-right border border-gray-300 rounded-lg px-4 py-2">
                                <AiOutlineFilePdf className="relative font-medium text-lg" />
                            </button>
                        </div>
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
                                    <td className='px-4 py-2 border text-nowrap'><StatusBadge status={data.status} /></td>
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

export default AccountTable;
