import React, { useEffect, useState } from 'react'
import { AiOutlineFilePdf } from 'react-icons/ai';
import { RiFileExcel2Line } from 'react-icons/ri';
import axios from 'axios';

const HistoryTable = ({ id }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

    const getMetricByCampaign = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${umaxUrl}/history?campaign_id=${id}&tenantId=${localStorage.getItem('tenant_id')}`, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setData(response.data.Data);
            console.log(response.data.Data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    useEffect(() => {
        getMetricByCampaign();
    }, [id]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    // const totalPages = Math.ceil(data.length / itemsPerPage);

    // const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // const getPaginationGroup = () => {
    //     let start = Math.floor((currentPage - 1) / 5) * 5;
    //     return new Array(5).fill().map((_, idx) => start + idx + 1).filter(page => page <= totalPages);
    // };

    // const goToNextPage = () => {
    //     setCurrentPage((page) => Math.min(page + 1, totalPages));
    // };

    // const goToPreviousPage = () => {
    //     setCurrentPage((page) => Math.max(page - 1, 1));
    // };

    return (
        <>
            <div className="w-full">
                <div className="w-full p-3">
                <h1 className="text-2xl font-semibold mb-3">History</h1>
                                <div className="w-full flex gap-3 justify-end pb-5">
                                    <button className="float-right border border-gray-300 rounded-lg px-3 py-2" >
                                        <RiFileExcel2Line className="relative font-medium text-lg" />
                                    </button>
                                    <button className="float-right border border-gray-300 rounded-lg px-3 py-2">
                                        <AiOutlineFilePdf className="relative font-medium text-lg" />
                                    </button>
                                </div>
                                <div className='overflow-x-auto'>
                                    <table className='w-full border-collapse'>
                                        <thead className='bg-white'>
                                            <tr className='text-left'>
                                                <th className='px-4 py-2 border text-nowrap'>Last Update</th>
                                                <th className='px-4 py-2 border text-nowrap'>Amount Spent</th>
                                                <th className='px-4 py-2 border text-nowrap'>Reach</th>
                                                <th className='px-4 py-2 border text-nowrap'>Impression</th>
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
                                        </thead>
                                        <tbody>
                                            {currentData.map((data, index) => (
                                                <tr key={index} className='border text-center'>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.timestamp_update}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.amountspent}</td>
                                                    <td className='px-4 py-2 border text-nowrap'>{data.reach === 1 ? 'Meta Ads' : data.platform === 2 ? 'Google Ads' : 'Tiktok Ads'}</td>
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
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                        {/* <nav aria-label="Page navigation example">
                            <ul className="flex items-center justify-end -space-x-px h-10 text-base mt-5">
                                <li>
                                    <a
                                        href="#"
                                        onClick={goToPreviousPage}
                                        className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 && 'cursor-not-allowed'}`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg
                                            className="w-3 h-3 rtl:rotate-180"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 1 1 5l4 4"
                                            />
                                        </svg>
                                    </a>
                                </li>
                                {getPaginationGroup().map((pageNumber, index) => (
                                    <li key={index}>
                                        <a
                                            href="#"
                                            onClick={() => paginate(pageNumber)}
                                            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${pageNumber === currentPage ? 'bg-blue-50 text-blue-600' : ''}`}
                                        >
                                            {pageNumber}
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <a
                                        href="#"
                                        onClick={goToNextPage}
                                        className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === totalPages && 'cursor-not-allowed'}`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg
                                            className="w-3 h-3 rtl:rotate-180"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 9 4-4-4-4"
                                            />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </nav> */}

                </div>
            </div>
        </>
    );
}

export default HistoryTable