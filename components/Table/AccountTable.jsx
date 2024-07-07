import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { RiFileExcel2Line } from 'react-icons/ri';
import LoadingCircle from '../Loading/LoadingCircle';
import Swal from "sweetalert2";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { BiEdit } from 'react-icons/bi';
import { MdDeleteForever } from 'react-icons/md';

const AccountTable = () => {
    const [tableData, setTableData] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isWideScreen, setIsWideScreen] = useState(true); // Set default to true
    const tableRef = useRef(null);
    const date = new Date();
    const dateWithTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0] +
        " " +
        (date.getHours().toString().padStart(2, "0")) +
        ":" +
        (date.getMinutes().toString().padStart(2, "0")) +
        ":" +
        (date.getSeconds().toString().padStart(2, "0"));
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
    };

    useEffect(() => {
        fetchData();
    }, []);

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: `Accounts ${dateWithTime}`,
        sheet: "DataAccounts",
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Account Data', 14, 15);
    
        const filteredData = tableData.map((row) => ({
            Name: row.username,
            Client: row.client_name,
            Platform: row.platform === 1 ? 'Meta Ads' : row.platform === 2 ? 'Google Ads' : row.platform === 3 ? 'Tiktok Ads' : '',
            Email: row.email,
            Status: row.status === 1 ? 'Active' : row.status === 2 ? 'Deactive' : '',
        }));
    
        const tableColumnNames = Object.keys(filteredData[0]);
        const tableColumnValues = filteredData.map((row) => Object.values(row));
     
        doc.autoTable({
            head: [tableColumnNames],
            body: tableColumnValues,
            startY: 20,
        });
    
        doc.save(`Account ${dateWithTime}.pdf`);
    };

    function ConfirmationModal(name) {
        if (name === 'pdf') {
            Swal.fire({
                title: 'Are you sure?',
                text: "File will be downloaded!",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, download it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    generatePDF();
                    Swal.fire({
                        title: 'Downloaded!',
                        text: 'Your file has been downloaded.',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    });
                }
            }).catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    confirmButtonColor: '#3085d6',
                });
            });
        } else if (name === 'excel') {
            Swal.fire({
                title: 'Are you sure?',
                text: "File will be downloaded!",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, download it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    onDownload();
                    Swal.fire(
                        'Downloaded!',
                        'Your file has been downloaded.',
                        'success'
                    );
                }
            }).catch((error) => {
                console.error('Error:', error);
            });
        }
    }

    const handleDelete = async (_id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            customClass: {
                confirmButton: 'custom-confirm-button-class',
                cancelButton: 'custom-cancel-button-class',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('jwtToken');
                    const response = await axios.delete(
                        `${umaxUrl}/account-delete?account_id=${_id}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
            
                    if (response.status === 200) {
                        fetchData();
                        Swal.fire({
                            title: 'Success!',
                            text: 'Data has been deleted.',
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            customClass: {
                                confirmButton: 'custom-ok-button-class',
                            },
                        });
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'Terjadi kesalahan saat menghapus data',
                            icon: 'error',
                            customClass: {
                                confirmButton: 'custom-error-button-class',
                            },
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Terjadi kesalahan saat menghapus data',
                        icon: 'error',
                        customClass: {
                            confirmButton: 'custom-error-button-class',
                        },
                    });
                }  
            }
        });
    };
    
    const handlePlatformChange = (event) => {
        setSelectedPlatform(event.target.value);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

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
                        <input
                            className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 rounded-lg px-2 text-[15px] text-semibold py-2`}
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
                    </div>
                    <div className="w-full flex gap-3 justify-end pb-5">
                        <button className="float-right border border-gray-300 rounded-lg px-5 py-2 text-end">+ Add</button>
                        <button className="float-right border border-gray-300 rounded-lg px-4 py-2" onClick={() => ConfirmationModal('excel')}>
                            <RiFileExcel2Line className="relative font-medium text-lg" />
                        </button>
                        <button className="float-right border border-gray-300 rounded-lg px-4 py-2" onClick={() => ConfirmationModal('pdf')}>
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
                            {filteredData.length > 0 ? (
                                filteredData.map((data, index) => (
                                    <tr key={index} className='border text-center'>
                                        <td className='px-4 py-2 border text-nowrap'>{data.username}</td>
                                        <td className='px-4 py-2 border text-nowrap'>{data.client_name}</td>
                                        <td className='px-4 py-2 border text-nowrap'>{data.platform === 1 ? 'Meta Ads' : data.platform === 2 ? 'Google Ads' : 'Tiktok Ads'}</td>
                                        <td className='px-4 py-2 border text-nowrap'>{data.email}</td>
                                        <td className='px-4 py-2 border text-nowrap'><StatusBadge status={data.status} /></td>
                                        <td className='px-4 py-2 border text-nowrap flex gap-1 justify-center'>
                                            <button className='bg-orange-500 text-white px-2 py-2 rounded-md me-1'>
                                                <BiEdit size={25}/>
                                            </button>
                                            <button className='bg-red-600 text-white px-2 py-2 rounded-md' onClick={() => handleDelete(data._id)}>
                                                <MdDeleteForever size={25}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                tableData.length > 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 border">
                                            Data Not Found
                                        </td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            <LoadingCircle />
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>

                    <table className='w-full border-collapse hidden' ref={tableRef}>
                        <thead className='bg-white'>
                            <tr className='text-left'>
                                <th className='px-4 py-2 border'>Name</th>
                                <th className='px-4 py-2 border'>Client</th>
                                <th className='px-4 py-2 border'>Platform</th>
                                <th className='px-4 py-2 border'>Email</th>
                                <th className='px-4 py-2 border'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((data, index) => (
                                <tr key={index} className='border text-center'>
                                    <td className='px-4 py-2 border text-nowrap'>{data.username}</td>
                                    <td className='px-4 py-2 border text-nowrap'>{data.client_name}</td>
                                    <td className='px-4 py-2 border text-nowrap'>{data.platform === 1 ? 'Meta Ads' : data.platform === 2 ? 'Google Ads' : 'Tiktok Ads'}</td>
                                    <td className='px-4 py-2 border text-nowrap'>{data.email}</td>
                                    <td className='px-4 py-2 border text-nowrap'>{data.status == 1 ? 'Active' : 'Deactive'}</td>
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
