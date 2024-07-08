'use client'

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { RiFileExcel2Line } from "react-icons/ri";
import { AiOutlineFilePdf } from "react-icons/ai";
import TableLoading from "../Loading/TableLoading";
import LoadingCircle from "../Loading/LoadingCircle";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import Swal from "sweetalert2";
import { BiEdit, BiFirstPage, BiLastPage, BiSolidArrowToLeft, BiSolidArrowToRight } from 'react-icons/bi';

export default function History({ id }) {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const dataPerPage = 10;
    const tableRef = useRef(null);
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';
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
        filename: `History ${dateWithTime}`,
        sheet: "DataCampaigns",
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Campaign Data', 14, 15);
    
        const filteredData = data.map((row, index) => ({
            No: index + 1,
            Date: row.timestamp_update,
            AmountSpent: row.amountspent,
            Reach: row.reach,
            Impressions: row.impressions,
            Frequency: row.frequency,
            RAR: row.rar,
            CPC: row.cpc,
            CTR: row.ctr,
            OCLP: row.oclp,
            CPR: row.cpr,
            ATC: row.atc,
            Roas: row.roas,
            Real_Roas: row.realroas,
        }));
    
        const tableColumnNames = Object.keys(filteredData[0]);
        const tableColumnValues = filteredData.map((row) => Object.values(row));
    
        doc.autoTable({
          head: [tableColumnNames],
          body: tableColumnValues,
          startY: 20,
        });
    
        doc.save(`History ${dateWithTime}.pdf`);
    };

    const getMetricByCampaign = useCallback(async () => {
        if (id == '') {
            console.warn("No campaign ID provided");
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${umaxUrl}/history?campaign_id=${id}&tenantId=${localStorage.getItem('tenant_id')}&page=${currentPage}&limit=${dataPerPage}`, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setData(response.data.Data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }, [id, currentPage]);

    useEffect(() => {
        getMetricByCampaign();
    }, [getMetricByCampaign]);

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

    const totalPages = Math.ceil(data.length / dataPerPage);

    // Function to change current page
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const pageButtons = [];
        const maxButtons = 3; // Maximum number of buttons to show
    
        // Previous button
        pageButtons.push(
            <button
                key="first"
                className={`px-3 py-1 border ${
                    currentPage === 1 ? "bg-gray-200 border-gray-300 border cursor-not-allowed" : "bg-white hover:bg-gray-100"
                } rounded-md`}
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
            >
                <BiFirstPage />
            </button>
        );
    
        // Previous button
        pageButtons.push(
            <button
                key="prev"
                className={`px-3 py-1 border ${
                    currentPage === 1 ? "bg-gray-200 border-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                } rounded-md`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <BiSolidArrowToLeft />
            </button>
        );
    
        // Render page buttons
        for (let i = 1; i <= totalPages; i++) {
            // Show only maxButtons buttons around the current page
            if (
                (i >= currentPage - Math.floor(maxButtons / 2) &&
                    i <= currentPage + Math.floor(maxButtons / 2))
            ) {
                pageButtons.push(
                    <button
                        key={i}
                        className={`px-3 py-1 border ${
                            i === currentPage ? "bg-gray-100 border-gray-300" : "bg-white hover:bg-gray-100"
                        } rounded-md`}
                        onClick={() => goToPage(i)}
                    >
                        {i}
                    </button>
                );
            } 
        }
    
        // Next button
        pageButtons.push(
            <button
                key="next"
                className={`px-3 py-1 border ${
                    currentPage === totalPages ? "bg-gray-200 border border-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                } rounded-md`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <BiSolidArrowToRight />
            </button>
        );
    
        // Next button
        pageButtons.push(
            <button
                key="last"
                className={`px-3 py-1 border ${
                    currentPage === totalPages ? "bg-gray-200 border border-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                } rounded-md`}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
            >
                <BiLastPage />
            </button>
        );
    
        return (
            <div className="flex justify-center gap-2 mt-4">
                {pageButtons}
            </div>
        );
    };
    
    
    const indexOfLastCampaign = currentPage * dataPerPage;
    const indexOfFirstCampaign = indexOfLastCampaign - dataPerPage;
    const currentHistory = data.slice(indexOfFirstCampaign, indexOfLastCampaign);

    return (
        <>
            <div className="w-full">
                <div className="w-full p-3">
                    {id == 0 && currentHistory.length == 0 ? (
                        <Suspense fallback={<TableLoading />}>
                            <TableLoading />
                        </Suspense>
                    ) : (
                        <>
                            <div className="w-full flex gap-3 justify-end pb-5">
                                <button className="float-right border border-gray-300 rounded-lg px-3 py-2">
                                    <RiFileExcel2Line className="relative font-medium text-lg" onClick={() => ConfirmationModal('excel')}/>
                                </button>
                                <button className="float-right border border-gray-300 rounded-lg px-3 py-2" disabled>
                                    <AiOutlineFilePdf className="relative font-medium text-lg" onClick={() => ConfirmationModal('pdf')}/>
                                </button>
                            </div>
                            <div className={`overflow-x-auto ${currentHistory.length > 0 ? 'shadow-md' : 'shadow-lg'}`}>
                                <table className='w-full border-collapse' ref={tableRef}>
                                    <thead className={currentHistory.length > 0 ? 'bg-blue-100' : 'bg-gray-100 rounded-md'}>
                                        {currentHistory.length > 0 ? (
                                            <tr>
                                                <th className='px-4 py-2 border text-nowrap'>No. </th>
                                                <th className='px-4 py-2 border text-nowrap'>Date</th>
                                                <th className='px-4 py-2 border text-nowrap'>Amount Spent</th>
                                                <th className='px-4 py-2 border text-nowrap'>Reach</th>
                                                <th className='px-4 py-2 border text-nowrap'>Impressions</th>
                                                <th className='px-4 py-2 border text-nowrap'>Frequency</th>
                                                <th className='px-4 py-2 border text-nowrap'>RAR</th>
                                                <th className='px-4 py-2 border text-nowrap'>CPC</th>
                                                <th className='px-4 py-2 border text-nowrap'>CTR</th>
                                                <th className='px-4 py-2 border text-nowrap'>OCLP</th>
                                                <th className='px-4 py-2 border text-nowrap'>CPR</th>
                                                <th className='px-4 py-2 border text-nowrap'>ATC</th>
                                                <th className='px-4 py-2 border text-nowrap'>ROAS</th>
                                                <th className='px-4 py-2 border text-nowrap'>Real ROAS</th>
                                            </tr>
                                        ) : (  
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <span className="bg-gray-300 text-nowrap w-20 text-transparent h-10 rounded-full animate-pulse">lorem ipsum</span>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <span className="bg-gray-300 text-nowrap w-20 text-transparent h-10 rounded-full animate-pulse">lorem ipsum</span>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <span className="bg-gray-300 text-nowrap w-20 text-transparent h-10 rounded-full animate-pulse">lorem ipsum</span>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <span className="bg-gray-300 text-nowrap w-20 text-transparent h-10 rounded-full animate-pulse">lorem ipsum</span>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <span className="bg-gray-300 text-nowrap w-20 text-transparent h-10 rounded-full animate-pulse">lorem ipsum</span>
                                                </th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody>
                                        {currentHistory.length > 0 ? (
                                            currentHistory.map((data, index) => (
                                                <tr key={index} className='border text-center'>
                                                    <td className='px-4 py-2 border text-nowrap'>{index + 1}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.timestamp_update}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.amountspent}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.reach}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.impressions}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.frequency}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.rar}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.cpc}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.ctr}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.oclp}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.cpr}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.atc}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.roas}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.realroas}</td>
                                                </tr>
                                            ))
                                        )
                                        :
                                            (
                                                <tr>
                                                    <td className='px-4 py-2 border text-center' colSpan='13'>
                                                        <LoadingCircle />
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                                        
                            </div>
                                {currentHistory.length > 0 && (
                                    <div className="flex justify-end mt-4">
                                        {renderPagination()}
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
