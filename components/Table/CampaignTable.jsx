'use client'

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDownloadExcel } from "react-export-table-to-excel";
import { RiFileExcel2Line } from "react-icons/ri";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { AiOutlineFilePdf } from "react-icons/ai";
import LoadingCircle from "../Loading/LoadingCircle";
import Swal from "sweetalert2";
import { BiEdit, BiFirstPage, BiLastPage, BiSolidArrowToLeft, BiSolidArrowToRight } from "react-icons/bi";
import { MdDeleteForever} from "react-icons/md";
import CreateCampaign from "../Create/CreateCampaign";
import CampaignDetail from "../Detail/CampaignDetail";
import { Lexend_Tera } from "next/font/google";

const CampaignTable = () => {
    const tableRef = useRef(null);
    const [tableData, setTableData] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [selectedObjective, setSelectedObjective] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isWideScreen, setIsWideScreen] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
    const umaxUrl = "https://umaxxnew-1-d6861606.deta.app";
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

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: `Campaigns ${dateWithTime}`,
        sheet: "DataCampaigns",
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Campaign Data', 14, 15);
    
        const filteredData = tableData.map((row, index) => ({
            No: index + 1,
            Name: row.name,
            Client: row.client,
            Platform: row.platform,
            Account: row.account,
            Objective: row.objective,
            'Start Date': row.startdate,
            Status: String(row.status),
        }));
    
        const tableColumnNames = Object.keys(filteredData[0]);
        const tableColumnValues = filteredData.map((row) => Object.values(row));
    
        doc.autoTable({
          head: [tableColumnNames],
          body: tableColumnValues,
          startY: 20,
        });
    
        doc.save(`Campaigns ${dateWithTime}.pdf`);
    };

    const handleDelete = async (_id) => {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
          cancelButtonColor: '#d33',
          confirmButtonColor: '#3085d6',
          customClass: {
            confirmButton: 'custom-confirm-button-class',
            cancelButton: 'custom-cancel-button-class',
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const token = localStorage.getItem('jwtToken');
              const response = await axios.delete(
                `${umaxUrl}/campaign-delete?campaign_id=${_id}`,
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
                  customClass: {
                    confirmButton: 'custom-ok-button-class',
                  },
                });
              } else {
                Swal.fire({
                  title: 'Error!',
                  text: 'Maaf Anda Tidak Dapat Menghapus Data.',
                  icon: 'error',
                  customClass: {
                    confirmButton: 'custom-error-button-class',
                  },
                });
              }
            } catch (error) {
              Swal.fire('Error', 'Terjadi kesalahan saat menghapus data.', 'error');
            }
          }
        });
    };

    // Status Badge
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
            backgroundColor: "#DCDCDC",
            color: '#6F6F6F',
            border: '0.3px solid #868686',
            padding: '5px 15px',
            fontSize: "12px",
            borderRadius: '6px',
            fontWeight: '500',
            };
            return (
            <span style={statusStyle}>Draft</span>
            );
        case 3:
            statusStyle = {
            backgroundColor: "#FFF2D1",
            color: '#E29117',
            border: '0.3px solid #FF6B00',
            padding: '4px 10px',
            fontSize: "12px",
            borderRadius: '7px',
            fontWeight: '500',
            };
            return (
            <span style={statusStyle}>Completed</span>
            );
        default:
            return "Unknown";
        }
    }

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
                console.error('Error:', error);
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

    const fetchData = async () => {
        try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${umaxUrl}/campaign-by-tenant`, {
            headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
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

    const handlePlatformChange = (event) => {
        setSelectedPlatform(event.target.value);
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    const handleObjectiveChange = (event) => {
        setSelectedObjective(event.target.value);
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to page 1 on search change
    };

    const handleSortChange = (event) => {
        setDataPerPage(event.target.value);
        setCurrentPage(1); // Reset to page 1 on data per page change
    };

    const checkDeviceWidth = () => {
        setIsWideScreen(window.innerWidth >= 947);
    };

    useEffect(() => {
        checkDeviceWidth();
        window.addEventListener('resize', checkDeviceWidth);
        return () => window.removeEventListener('resize', checkDeviceWidth);
    }, []);

    const handleOpenModal = (campaign) => {
        setSelectedCampaign(campaign);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setSelectedCampaign(null);
    };

    // Filter data before paginating
    const filteredData = tableData.filter((data) => {
        const client_name = localStorage.getItem('name');
        const role = localStorage.getItem('roles');
        if (role !== 'client') {
            return (
                (!selectedPlatform || data.platform === Number(selectedPlatform)) &&
                (!selectedObjective || data.objective === Number(selectedObjective)) &&
                (!searchTerm || data.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        } else {
            return (
                (!selectedPlatform || data.platform === Number(selectedPlatform)) &&
                (!selectedObjective || data.objective === Number(selectedObjective)) &&
                (!searchTerm || data.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                data.client_name.toLowerCase() === client_name.toLowerCase()
            );
        }
    });

    // Calculate total number of pages
    const totalPages = searchTerm ? 1 : Math.ceil(filteredData.length / dataPerPage);

    // Function to change current page
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const pageButtons = [];
        const maxButtons = 3; // Maximum number of buttons to show

        // First page button
        pageButtons.push(
            <button
                key="first"
                className={`px-3 py-1 dark:text-white ${currentPage === 1 ? 'cursor-not-allowed' : ''} rounded-md`}
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
            >
                {'<<'}
            </button>
        );

        // Previous page button
        pageButtons.push(
            <button
                key="prev"
                className={`px-3 py-1 dark:text-white ${currentPage === 1 ? 'cursor-not-allowed' : ''} rounded-md`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {'<'}
            </button>
        );

        // Info page
        pageButtons.push(
            <span key="info" className="px-3 py-1 dark:text-white rounded-md">
                {`Page ${currentPage} / ${totalPages}`}
            </span>
        );

        // Next page button
        pageButtons.push(
            <button
                key="next"
                className={`px-3 py-1 dark:text-white ${currentPage === totalPages ? 'cursor-not-allowed' : ''} rounded-md`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {'>'}
            </button>
        );

        // Last page button
        pageButtons.push(
            <button
                key="last"
                className={`px-3 py-1 dark:text-white ${currentPage === totalPages ? 'cursor-not-allowed' : ''} rounded-md`}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
            >
                {'>>'}
            </button>
        );

        return <div className="flex justify-center gap-2 mt-4">{pageButtons}</div>;
    };

    const indexOfLastCampaign = currentPage * dataPerPage;
    const indexOfFirstCampaign = indexOfLastCampaign - dataPerPage;
    let currentCampaigns = filteredData.slice(indexOfFirstCampaign, indexOfLastCampaign)
    
    return (
        <>
            <div className={`font-semibold text-3xl text-slate-800 dark:text-slate-200 mb-10`}>
                <h1>Campaigns</h1>
                </div>
                <div className={`bg-white dark:bg-gray-800 ${modalIsOpen ? 'overflow-hidden' : ''} border border-gray-300 dark:border-gray-700 rounded-lg p-5`} style={{ width: "100%" }}>
                <div className={`flex ${isWideScreen ? "flex-row" : "flex-col"}`}>
                    <div className={`mb-4 flex flex-row items-start gap-4`}>
                        <input
                            className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 dark:border-gray-700 rounded-lg px-2 text-[15px] text-semibold py-2 dark:bg-gray-700 dark:text-gray-200`}
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <select
                            className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 dark:border-gray-700 rounded-lg px-2 md:text-[15px] text-[12px] text-semibold py-2 dark:bg-gray-700 dark:text-gray-300`}
                            value={selectedPlatform}
                            onChange={handlePlatformChange}
                        >
                            <option value="">Platform</option>
                            <option value="1">Meta Ads</option>
                            <option value="2">Google Ads</option>
                            <option value="3">Tiktok Ads</option>
                        </select>
                        <select
                            className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 dark:border-gray-700 rounded-lg px-2 md:text-[15px] text-[12px] text-semibold py-2 dark:bg-gray-700 dark:text-gray-300`}
                            value={selectedObjective}
                            onChange={handleObjectiveChange}
                        >
                            <option value="">Objective</option>
                            <option value="1">Awareness</option>
                            <option value="2">Concervation</option>
                            <option value="3">Consideration</option>
                        </select>
                    </div>
                    <div className="w-full flex gap-3 justify-end pb-5">
                        <select className="float-right border border-gray-300 dark:border-gray-600 rounded-lg px-2 md:text-[15px] text-[12px] text-semibold py-2 dark:bg-gray-700 dark:text-gray-300"
                            value={dataPerPage}
                            onChange={handleSortChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                        <button className="float-right border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-lg px-4 py-2" onClick={() => ConfirmationModal('excel')}>
                            <RiFileExcel2Line className="relative font-medium text-lg text-gray-800 dark:text-gray-200" />
                        </button>
                        <button className="float-right border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-lg px-4 py-2" onClick={() => ConfirmationModal('pdf')}>
                            <AiOutlineFilePdf className="relative font-medium text-lg text-gray-800 dark:text-gray-200" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white dark:bg-blue-700">
                            <tr className="text-left">
                                <th className="px-2 py-2 border dark:border-gray-600 dark:text-slate-200">No.</th>
                                <th className="px-2 py-2 border dark:border-gray-600 dark:text-slate-200">Name</th>
                                <th className="px-2 py-2 border dark:border-gray-600 dark:text-slate-200">Client</th>
                                <th className="px-2 py-2 border dark:border-gray-600 dark:text-slate-200">Platform</th>
                                <th className="px-2 py-2 border dark:border-gray-600 dark:text-slate-200">Account</th>
                                <th className="px-2 py-2 border dark:border-gray-600 dark:text-slate-200">Objective</th>
                                <th className="px-2 py-2 border dark:border-gray-600 dark:text-slate-200">Start Date</th>
                                <th className="px-2 py-2 border dark:border-gray-600 dark:text-slate-200">Status</th>
                                <th className="px-2 py-2 border dark:border-gray-600 dark:text-slate-200 hidden">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCampaigns.length > 0 ? (
                                currentCampaigns.map((data, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="px-2 py-2 border text-nowrap text-left dark:border-gray-700 dark:text-gray-200">{index + 1}.</td>
                                        <td className="px-2 py-2 border text-nowrap dark:border-gray-700 dark:text-gray-200">
                                            <button className="text-gray-500 dark:text-gray-300 underline" title={`Detail of ${data.nama}`} onClick={() => handleOpenModal(data)}>
                                                <p className="underline">{data.name}</p>
                                            </button>
                                        </td>
                                        <td className="px-2 py-2 border text-nowrap dark:border-gray-700 dark:text-gray-200">{data.client_name}</td>
                                        <td className="px-2 py-2 border text-nowrap dark:border-gray-700 dark:text-gray-200">
                                            {data.platform === 1 ? "Meta Ads" : data.platform === 2 ? "Google Ads" : "Tiktok Ads"}
                                        </td>
                                        <td className="px-2 py-2 border text-nowrap dark:border-gray-700 dark:text-gray-200">{data.account_name}</td>
                                        <td className="px-2 py-2 border text-nowrap dark:border-gray-700 dark:text-gray-200">
                                            {data.objective === 1 ? "Awareness" : data.objective === 2 ? "Concervation" : "Consideration"}
                                        </td>
                                        <td className="px-2 py-2 border text-nowrap dark:border-gray-700 dark:text-gray-200">{data.start_date}</td>
                                        <td className="px-2 py-2 border text-nowrap dark:border-gray-700 dark:text-gray-200">
                                            <StatusBadge status={data.status} />
                                        </td>
                                        <td className="px-2 py-2 border text-nowrap hidden gap-1 justify-center dark:border-gray-700 dark:text-gray-200">
                                            <button className='bg-orange-500 text-white px-2 py-2 rounded-md me-1'>
                                                <BiEdit size={25} />
                                            </button>
                                            <button className='bg-red-600 text-white px-2 py-2 rounded-md' onClick={() => handleDelete(data._id)}>
                                                <MdDeleteForever size={25} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : tableData.length > 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 border dark:border-gray-700 dark:text-gray-200">Data Not Found</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center dark:border-gray-700">
                                        <LoadingCircle />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-center sm:justify-end md:justify-end lg:justify-end xl:justify-end items-center">
                        {renderPagination()}
                    </div>

                    <table className="w-full border hidden" ref={tableRef}>
                        <thead className="bg-white dark:bg-gray-700">
                            <tr className="text-left">
                                <th className="px-4 py-2 border dark:border-gray-700">No.</th>
                                <th className="px-4 py-2 border dark:border-gray-700">Name</th>
                                <th className="px-4 py-2 border dark:border-gray-700">Client</th>
                                <th className="px-4 py-2 border dark:border-gray-700">Platform</th>
                                <th className="px-4 py-2 border dark:border-gray-700">Account</th>
                                <th className="px-4 py-2 border dark:border-gray-700">Objective</th>
                                <th className="px-4 py-2 border dark:border-gray-700">Start Date</th>
                                <th className="px-4 py-2 border dark:border-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((data, index) => (
                                <tr key={index} className="text-center">
                                    <td className="px-4 py-2 border text-nowrap text-left dark:border-gray-700">{index + 1}.</td>
                                    <td className="px-4 py-2 border text-nowrap dark:border-gray-700">{data.name}</td>
                                    <td className="px-4 py-2 border text-nowrap dark:border-gray-700">{data.client_name}</td>
                                    <td className="px-4 py-2 border text-nowrap dark:border-gray-700">
                                        {data.platform === 1 ? "Meta Ads" : data.platform === 2 ? "Google Ads" : "Tiktok Ads"}
                                    </td>
                                    <td className="px-4 py-2 border text-nowrap dark:border-gray-700">{data.account_name}</td>
                                    <td className="px-4 py-2 border text-nowrap dark:border-gray-700">
                                        {data.objective === 1 ? "Awareness" : data.objective === 2 ? "Concervation" : "Consideration"}
                                    </td>
                                    <td className="px-4 py-2 border text-nowrap dark:border-gray-700">{data.start_date}</td>
                                    <td className="px-4 py-2 border text-nowrap dark:border-gray-700">
                                        {data.status === 1 ? "Active" : data.status === 2 ? "Draft" : "Completed"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedCampaign && (
                <CampaignDetail isOpen={modalIsOpen} onClose={handleCloseModal} data={selectedCampaign} />
            )}
        </>
    )
}

export default CampaignTable