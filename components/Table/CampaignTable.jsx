'use client'

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDownloadExcel } from "react-export-table-to-excel";
import { RiFileExcel2Line } from "react-icons/ri";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { AiOutlineFilePdf } from "react-icons/ai";

const CampaignTable = () => {
    const tableRef = useRef(null);
    const [tableData, setTableData] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [selectedObjective, setSelectedObjective] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 947);
    const umaxUrl = "https://umaxxnew-1-d6861606.deta.app";

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "DataCampaigns",
        sheet: "DataCampaigns",
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Campaign Data', 14, 15);
    
        const filteredData = tableData.map((row) => ({
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
    
        doc.save('campaigns.pdf');
    };

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
    };

    const handleObjectiveChange = (event) => {
        setSelectedObjective(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = tableData.filter((data) => {
        return (
        (!selectedPlatform || data.platform === Number(selectedPlatform)) &&
        (!selectedObjective || data.objective === Number(selectedObjective)) &&
        (!searchTerm ||
            data.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const checkDeviceWidth = () => {
        setIsWideScreen(window.innerWidth >= 947);
    };

    useEffect(() => {
        window.addEventListener("resize", checkDeviceWidth);
        return () => window.removeEventListener("resize", checkDeviceWidth);
    }, []);

    return (
        <>
            <div className="font-semibold text-3xl text-slate-800 mb-10">
                <h1>Campaigns</h1>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-5" style={{ width: "100%" }}>
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
                            <select
                                name=""
                                className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 rounded-lg px-2 md:text-[15px] text-[12px] text-semibold py-2`}
                                id=""
                                // style={{ width: "200px" }}
                                value={selectedPlatform}
                                onChange={handlePlatformChange}
                                >
                                <option value="">Platform</option>
                                <option value="1">Meta Ads</option>
                                <option value="2">Google Ads</option>
                                <option value="3">Tiktok Ads</option>
                            </select>
                            <select
                                name=""
                                className={`border h-10 ${isWideScreen ? 'w-[200px]' : 'w-1/3'} border-gray-300 rounded-lg px-2 md:text-[15px] text-[12px] text-semibold py-2`}
                                // style={{ width: "200px" }}
                                id=""
                                value={selectedObjective}
                                onChange={handleObjectiveChange}
                                >
                                <option value="">Objective</option>
                                <option value="1">Awareness</option>
                                <option value="2">Concervation</option>
                                <option value="3">Consideration</option>
                            </select>
                        {/* {'Filter ends here'} */}
                    </div>
                    <div className="w-full flex gap-3 justify-end pb-5">
                        <button className="float-right border border-gray-300 rounded-lg px-5 py-2 text-end">+ Add</button>
                        <button className="float-right border border-gray-300 rounded-lg px-4 py-2" onClick={onDownload}>
                            <RiFileExcel2Line className="relative font-medium text-lg" />
                        </button>
                        <button className="float-right border border-gray-300 rounded-lg px-4 py-2" onClick={generatePDF}>
                            <AiOutlineFilePdf className="relative font-medium text-lg" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-md">
                    <table className="w-full border">
                        <thead className="bg-white">
                            <tr className="text-left">
                            <th className="px-2 py-2 border">Name</th>
                            <th className="px-2 py-2 border">Client</th>
                            <th className="px-2 py-2 border">Platform</th>
                            <th className="px-2 py-2 border">Account</th>
                            <th className="px-2 py-2 border">Objective</th>
                            <th className="px-2 py-2 border">Start Date</th>
                            <th className="px-2 py-2 border">Status</th>
                            <th className="px-2 py-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((data, index) => (
                            <tr key={index} className="text-center">
                                <td className="px-2 py-2 border text-nowrap">
                                    <button className="text-blue-500">
                                        <p className="underline">
                                            {data.name}
                                        </p>
                                    </button>
                                </td>
                                <td className="px-2 py-2 border text-nowrap">
                                {data.client_name}
                                </td>
                                <td className="px-2 py-2 border text-nowrap">
                                {data.platform === 1
                                    ? "Meta Ads"
                                    : data.platform === 2
                                    ? "Google Ads"
                                    : "Tiktok Ads"}
                                </td>
                                <td className="px-2 py-2 border text-nowrap">
                                {data.account_name}
                                </td>
                                <td className="px-2 py-2 border text-nowrap">
                                {data.objective === 1
                                    ? "Awareness"
                                    : data.objective === 2
                                    ? "Concervation"
                                    : "Consideration"}
                                </td>
                                <td className="px-2 py-2 border text-nowrap">
                                {data.start_date}
                                </td>
                                <td className="px-2 py-2 border text-nowrap">
                                {data.status === 1
                                    ? "Active"
                                    : data.status === 2
                                    ? "Draft"
                                    : "Competed"}
                                </td>
                                <td className="px-2 py-2 border text-nowrap flex">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded me-1">
                                    Edit
                                </button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded">
                                    Delete
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* table for ekspor */}
                    <table className="w-full border hidden" ref={tableRef}>
                        <thead className="bg-white">
                            <tr className="text-left">
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Client</th>
                            <th className="px-4 py-2 border">Platform</th>
                            <th className="px-4 py-2 border">Account</th>
                            <th className="px-4 py-2 border">Objective</th>
                            <th className="px-4 py-2 border">Start Date</th>
                            <th className="px-4 py-2 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((data, index) => (
                            <tr key={index} className="text-center">
                                <td className="px-4 py-2 border text-nowrap">{data.name}</td>
                                <td className="px-4 py-2 border text-nowrap">
                                {data.client_name}
                                </td>
                                <td className="px-4 py-2 border text-nowrap">
                                {data.platform === 1
                                    ? "Meta Ads"
                                    : data.platform === 2
                                    ? "Google Ads"
                                    : "Tiktok Ads"}
                                </td>
                                <td className="px-4 py-2 border text-nowrap">
                                {data.account_name}
                                </td>
                                <td className="px-4 py-2 border text-nowrap">
                                {data.objective === 1
                                    ? "Awareness"
                                    : data.objective === 2
                                    ? "Concervation"
                                    : "Consideration"}
                                </td>
                                <td className="px-4 py-2 border text-nowrap">
                                {data.start_date}
                                </td>
                                <td className="px-4 py-2 border text-nowrap">
                                {data.status === 1
                                    ? "Active"
                                    : data.status === 2
                                    ? "Draft"
                                    : "Competed"}
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

export default CampaignTable