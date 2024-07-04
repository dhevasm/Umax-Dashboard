'use client'

import { useEffect, useState } from "react";
import axios from "axios";

export default function History({ id }) {
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

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / 5) * 5;
        return new Array(5).fill().map((_, idx) => start + idx + 1).filter(page => page <= totalPages);
    };

    const goToNextPage = () => {
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((page) => Math.max(page - 1, 1));
    };

    return (
        <>
            <div className="w-full">
                <div className="w-full">
                    <div className="border border-gray-300 rounded-md min-h-[50vh] p-3"> 
                        <div className="w-full flex justify-end gap-2 p-2">
                            <div className="w-[35px] h-[35px] bg-blue-200">
                                {/* <img src="../assets/filter.svg" alt="filter" /> */}
                            </div>
                            <div className="w-[35px] h-[35px] bg-blue-200">
                                {/* <img src="../assets/filter.svg" alt="filter" /> */}
                            </div>
                        </div>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-white uppercase bg-blue-500">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-nowrap">Last Update</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">Amount Spent</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">Reach</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">Impression</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">Frequency</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">RAR</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">CPC</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">CTR</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">OCLP</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">CPR</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">ATC</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">ROAS</th>
                                        <th scope="col" className="px-6 py-3 text-nowrap">Real ROAS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((item, index) => (
                                        <tr key={index} className="bg-slate-100 border-b hover:bg-gray-200 text-black even:bg-slate-200">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.timestamp_update}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.amountspent}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.reach}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.impressions}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.frequency}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.rar}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.cpc}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.ctr}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.oclp}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.cpr}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.atc}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.roas}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.realroas}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <nav aria-label="Page navigation example">
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
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}
