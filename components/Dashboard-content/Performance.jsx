'use client'

import Infocard from "../Card/Infocard"
import SuggestionCard from "../Card/SuggestionCard"
export default function Performance(){

    return (    
        <>
        <div className="w-full">
            {/* Header */}
            <div className="flex w-full justify-end gap-7 items-center" >
                <p>Feb 4, 20:12</p>
                <select className="border border-gray-300 rounded-md shadow-sm p-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                </select>
            </div>
            {/* Content */}
            <div className="w-full mt-5">

                {/* Infocard & Chart */}
                <div className="flex flex-col md:flex-row justify-between gap-5">
                    {/* Infocard */}
                    <div className="md:w-[40%]  flex flex-col gap-5 ">
                    <Infocard Color="success" Title="Amount Spend" Value="Rp. 2000.000" Desc="Total Campaigns"/>
                    <Infocard Color="warning" Title="Amount Spend" Value="Rp. 2000.000" Desc="Total Campaigns"/>
                    <Infocard Color="blue" Title="Amount Spend" Value="Rp. 2000.000" Desc="Total Campaigns"/>
                    <Infocard Color="yellow" Title="Amount Spend" Value="Rp. 2000.000" Desc="Total Campaigns"/>
                    </div>
                    {/* Chart */}
                    <div className="md:w-[60%] flex flex-col justify-end">
                        Lokasi Chart

                        {/* Inforcard 2 */}
                        <div className="flex flex-col md:flex-row gap-5">
                            <Infocard Color="success" Title="Amount" Value="2000" Desc="Total Campaigns"/>
                            <Infocard Color="green" Title="Amount" Value="2000" Desc="Total Campaigns"/>
                            <Infocard Color="warning" Title="Amount" Value="2000" Desc="Total Campaigns"/>
                            <Infocard Color="yellow" Title="Amount" Value="2000" Desc="Total Campaigns"/>
                        </div>
                    </div>
                </div>

                {/* Suggestion */}
                <div className="w-full h-0.5 bg-white my-5"></div>
                <h1>Suggestions</h1>
                <SuggestionCard Title="Title" Desc="Desc" Color="warning" Value="Value" Target="Target" Message="Message"/>
                <SuggestionCard Title="Title" Desc="Desc" Color="success" Value="Value" Target="Target" Message="Message"/>
                <SuggestionCard Title="Title" Desc="Desc" Color="blue" Value="Value" Target="Target" Message="Message"/>
            </div>
        </div>
        </>
    )
}