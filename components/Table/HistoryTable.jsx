import React, { useEffect, useState } from 'react';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { RiFileExcel2Line } from 'react-icons/ri';
import axios from 'axios';
import Pagination from '../Pagination/Pagination';

const HistoryTable = ({ id }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
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
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="w-full">
                <div className="w-full p-3">
                    <h1 className="text-2xl font-semibold mb-3 text-indigo-600">History</h1>
                    <div className="w-full flex gap-3 justify-end pb-5">
                        <button className="float-right border border-indigo-600 rounded-lg px-3 py-2" >
                            <RiFileExcel2Line className="relative font-medium text-lg text-indigo-600" />
                        </button>
                        <button className="float-right border border-indigo-600 rounded-lg px-3 py-2">
                            <AiOutlineFilePdf className="relative font-medium text-lg text-indigo-600" />
                        </button>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full border-collapse'>
                            <thead className='bg-indigo-600'>
                                <tr className='text-white'>
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
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={data.length}
                        paginate={handlePageClick}
                        currentPage={currentPage}
                        pageNumbers={pageNumbers}
                    />
                </div>
            </div>
        </>
    );
}

export default HistoryTable
