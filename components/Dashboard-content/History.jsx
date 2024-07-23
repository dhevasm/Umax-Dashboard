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

export default function History({ id }) {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
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

    const handleSortChange = (event) => {
        setDataPerPage(event.target.value);
    }

    const totalPages = Math.ceil(data.length / dataPerPage);

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
                className={`px-3 py-1 ${
                    currentPage === 1 ? "cursor-not-allowed" : ""
                } rounded-md`}
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
                className={`px-3 py-1 ${
                    currentPage === 1 ? "cursor-not-allowed" : ""
                } rounded-md`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {'<'}
            </button>
        );
    
        // Info page
        pageButtons.push(
            <span key="info" className="px-3 py-1 rounded-md">
                {`Page ${currentPage} / ${totalPages}`}
            </span>
        );
    
        // Next page button
        pageButtons.push(
            <button
                key="next"
                className={`px-3 py-1 ${
                    currentPage === totalPages ? "cursor-not-allowed" : ""
                } rounded-md`}
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
                className={`px-3 py-1 ${
                    currentPage === totalPages ? "cursor-not-allowed" : ""
                } rounded-md`}
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
            >
                {'>>'}
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
                    {id === '' ? (
                        <Suspense fallback={<TableLoading />}>
                            <TableLoading />
                        </Suspense>
                    ) : (
                        <>
                            <div className="w-full flex gap-3 justify-end pb-5">
                                <select className="float-right border border-gray-300 dark:border-gray-700 rounded-lg px-2 md:text-[15px] text-[12px] dark:text-white text-semibold py-2 dark:bg-gray-800"
                                    value={dataPerPage}
                                    onChange={handleSortChange}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                </select>
                                <button className="float-right border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2">
                                    <RiFileExcel2Line className="relative font-medium text-lg" onClick={() => ConfirmationModal('excel')} />
                                </button>
                                <button className="float-right border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2" disabled title="Not yet available">
                                    <AiOutlineFilePdf className="relative font-medium text-lg" onClick={() => ConfirmationModal('pdf')} />
                                </button>
                            </div>
                            <div className={`overflow-x-auto ${currentHistory.length > 0 ? 'shadow-md' : 'shadow-lg'}`}>
                                <table className='w-full border-collapse' ref={tableRef}>
                                    <thead className={currentHistory.length > 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-slate-700 rounded-md'}>
                                        {currentHistory.length > 0 ? (
                                            <tr>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>No.</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>Date</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>Amount Spent</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>Reach</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>Impressions</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>Frequency</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>RAR</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>CPC</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>CTR</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>OCLP</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>CPR</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>ATC</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>ROAS</th>
                                                <th className='px-4 py-2 border text-nowrap dark:border-gray-600'>Real ROAS</th>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border dark:border-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                    <span className="bg-gray-300 dark:bg-gray-600 text-nowrap w-20 text-transparent h-10 rounded-full animate-pulse">lorem ipsum</span>
                                                </th>
                                                {/* Repeat for other headers */}
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody>
                                        {currentHistory.length > 0 ? (
                                            currentHistory.map((data, index) => (
                                                <tr key={index} className='border text-center dark:border-gray-600'>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{index + 1}.</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.timestamp_update}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.amountspent}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.reach}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.impressions}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.frequency}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.rar}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.cpc}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.ctr}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.oclp}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.cpr}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.atc}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.roas}</td>
                                                    <td className='px-4 py-2 border text-nowrap dark:border-gray-600'>{data.realroas}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className='px-4 py-2 border text-center dark:border-gray-600' colSpan='14'>
                                                    <LoadingCircle />
                                                </td>
                                            </tr>
                                        )}
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
