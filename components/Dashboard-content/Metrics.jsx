'use client'

import { useEffect, useState } from "react";
import MetricCard from "../Card/MetricCard"
import axios from "axios";
import MetricsLoading from "../Loading/MetricsLoading";

export default function Metrics({id}){
    const [data, setData] = useState([]);
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

    const getMetricByCampaign = async () => {
        try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${umaxUrl}/metric-by-campaign-id?campaign_id=${id}&tenantId=${localStorage.getItem('tenant_id')}`, {
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
    }, []);

    return (    
        <>
        <div className="w-full">
            {/* Content */}
            <div className="w-full">
            {/* Metrics */}
            <div className="flex flex-wrap gap-10">
                {id == '' 
                ? 
                    Array(12).fill(0).map((item, index) => (
                        <MetricsLoading key={index} />
                    ))
                :
                data.map((item) => (
                    <div className="flex flex-wrap justify-center gap-10">  
                        <MetricCard Value={item.amountspent} Title={'Amout Spent'} />
                        <MetricCard Value={item.reach} Title={'Reach'} />
                        <MetricCard Value={item.impressions} Title={'Impression'} />
                        <MetricCard Value={item.frequency} Title={'Frequency'} />
                        <MetricCard Value={item.rar} Title={'RAR'} />
                        <MetricCard Value={item.cpc} Title={'CPC'} />
                        <MetricCard Value={item.ctr} Title={'CTR'} />
                        <MetricCard Value={item.oclp} Title={'OCLP'} />
                        <MetricCard Value={item.cpr} Title={'CPR'} />
                        <MetricCard Value={item.atc} Title={'ATC'} />
                        <MetricCard Value={item.roas} Title={'ROAS'} />
                        <MetricCard Value={item.realroas} Title={'Real ROAS'} />
                    </div>
                ))
                }
            </div>

            </div>
        </div>
        </>
    )
}