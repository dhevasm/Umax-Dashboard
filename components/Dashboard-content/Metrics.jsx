import { useEffect, useState } from "react";
import MetricCard from "../Card/MetricCard";
import axios from "axios";
import MetricsLoading from "../Loading/MetricsLoading";

export default function Metrics({ id }) {
    const [activeCard, setActiveCard] = useState(null);
    const [data, setData] = useState([]);
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

    const getMetricByCampaign = async () => {
        if (!id) {
            console.warn("No campaign ID provided");
            return;
        }
        
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
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    useEffect(() => {
        getMetricByCampaign();
    }, [id]); // Trigger useEffect whenever id changes

    const handleToggle = (id) => {
        setActiveCard(activeCard === id ? null : id);
    };

    return (    
        <div className="w-full">
            {/* Content */}
            <div className="w-full">
                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                    {id === '' 
                        ? Array(12).fill(0).map((_, index) => (
                            <MetricsLoading key={index + 1} />
                        ))
                        : data.flatMap((item, index) => [
                            <MetricCard
                                key={`${index}-1`}
                                id={1}
                                Value={item.amountspent}
                                Title={'Amount Spent'}
                                onToggle={handleToggle}
                                isActive={activeCard === 1}
                            />,
                            <MetricCard
                                key={`${index}-2`}
                                id={2}
                                Value={item.reach}
                                Title={'Reach'}
                                onToggle={handleToggle}
                                isActive={activeCard === 2}
                            />,
                            <MetricCard
                                key={`${index}-3`}
                                id={3}
                                Value={item.impressions}
                                Title={'Impression'}
                                onToggle={handleToggle}
                                isActive={activeCard === 3}
                            />,
                            <MetricCard
                                key={`${index}-4`}
                                id={4}
                                Value={item.frequency}
                                Title={'Frequency'}
                                onToggle={handleToggle}
                                isActive={activeCard === 4}
                            />,
                            <MetricCard
                                key={`${index}-5`}
                                id={5}
                                Value={item.rar}
                                Title={'RAR'}
                                onToggle={handleToggle}
                                isActive={activeCard === 5}
                            />,
                            <MetricCard
                                key={`${index}-6`}
                                id={6}
                                Value={item.cpc}
                                Title={'CPC'}
                                onToggle={handleToggle}
                                isActive={activeCard === 6}
                            />,
                            <MetricCard
                                key={`${index}-7`}
                                id={7}
                                Value={item.ctr}
                                Title={'CTR'}
                                onToggle={handleToggle}
                                isActive={activeCard === 7}
                            />,
                            <MetricCard
                                key={`${index}-8`}
                                id={8}
                                Value={item.oclp}
                                Title={'OCLP'}
                                onToggle={handleToggle}
                                isActive={activeCard === 8}
                            />,
                            <MetricCard
                                key={`${index}-9`}
                                id={9}
                                Value={item.cpr}
                                Title={'CPR'}
                                onToggle={handleToggle}
                                isActive={activeCard === 9}
                            />,
                            <MetricCard
                                key={`${index}-10`}
                                id={10}
                                Value={item.atc}
                                Title={'ATC'}
                                onToggle={handleToggle}
                                isActive={activeCard === 10}
                            />,
                            <MetricCard
                                key={`${index}-11`}
                                id={11}
                                Value={item.roas}
                                Title={'ROAS'}
                                onToggle={handleToggle}
                                isActive={activeCard === 11}
                            />,
                            <MetricCard
                                key={`${index}-12`}
                                id={12}
                                Value={item.realroas}
                                Title={'Real ROAS'}
                                onToggle={handleToggle}
                                isActive={activeCard === 12}
                            />,
                        ])
                    }
                </div>
            </div>
        </div>
    );
}
