'use client'

import { Suspense, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { RiFileExcel2Line } from "react-icons/ri";
import { AiOutlineFilePdf } from "react-icons/ai";
import TableLoading from "../Loading/TableLoading";

export default function History({ id }) {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

    const getMetricByCampaign = useCallback(async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${umaxUrl}/history?campaign_id=${id}&tenantId=${localStorage.getItem('tenant_id')}&page=${currentPage}&limit=${itemsPerPage}`, {
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
    }, [id, currentPage]);

    useEffect(() => {
        getMetricByCampaign();
    }, [getMetricByCampaign]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <div className="w-full">
                <div className="w-full p-3">
                    {id == 0 && currentData.length == 0 ? (
                        <Suspense fallback={<TableLoading />}>
                            <TableLoading />
                        </Suspense>
                    ) : (
                        <>
                            <h1 className="text-2xl font-semibold mb-3">History</h1>
                            <div className="w-full flex gap-3 justify-end pb-5">
                                <button className="float-right border border-gray-300 rounded-lg px-3 py-2">
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
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
