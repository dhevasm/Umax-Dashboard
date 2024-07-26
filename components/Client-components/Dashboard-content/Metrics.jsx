import { useEffect, useState, useCallback } from "react";
import MetricCard from "../Card/MetricCard";
import axios from "axios";
import MetricsLoading from "../Loading/MetricsLoading";
import { useTranslations } from 'next-intl';

export default function Metrics({ id }) {
    const [activeCard, setActiveCard] = useState(null);
    const [data, setData] = useState([]);
    const t = useTranslations('metrics');
    const umaxUrl = process.env.NEXT_PUBLIC_API_URL;

    // Memoize getMetricByCampaign with useCallback
    const getMetricByCampaign = useCallback(async () => {
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
    }, [id, umaxUrl]);

    useEffect(() => {
        getMetricByCampaign();
    }, [getMetricByCampaign]); // Trigger useEffect whenever getMetricByCampaign changes

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
                        : data.map((item, index) => [
                            <MetricCard
                                key={`${index}-1`}
                                id={1}
                                Value={item.amountspent}
                                Title={t('amount-spent')}
                                onToggle={handleToggle}
                                Description={t('amount-desc')}
                                isActive={activeCard === 1}
                            />,
                            <MetricCard
                                key={`${index}-2`}
                                id={2}
                                Value={item.reach}
                                Title={t('reach')}
                                onToggle={handleToggle}
                                Description={t('reach-desc')}
                                isActive={activeCard === 2}
                            />,
                            <MetricCard
                                key={`${index}-3`}
                                id={3}
                                Value={item.impressions}
                                Title={t('impressions')}
                                onToggle={handleToggle}
                                Description={t('impressions-desc')}
                                isActive={activeCard === 3}
                            />,
                            <MetricCard
                                key={`${index}-4`}
                                id={4}
                                Value={item.frequency}
                                Title={t('frequency')}
                                onToggle={handleToggle}
                                Description={t('frequency-desc')}
                                isActive={activeCard === 4}
                            />,
                            <MetricCard
                                key={`${index}-5`}
                                id={5}
                                Value={item.rar}
                                Title={t('rar')}
                                onToggle={handleToggle}
                                Description={t('rar-desc')}
                                isActive={activeCard === 5}
                            />,
                            <MetricCard
                                key={`${index}-6`}
                                id={6}
                                Value={item.cpc}
                                Title={t('cpc')}
                                onToggle={handleToggle}
                                Description={t('cpc-desc')}
                                isActive={activeCard === 6}
                            />,
                            <MetricCard
                                key={`${index}-7`}
                                id={7}
                                Value={item.ctr}
                                Title={t('ctr')}
                                onToggle={handleToggle}
                                Description={t('ctr-desc')}
                                isActive={activeCard === 7}
                            />,
                            <MetricCard
                                key={`${index}-8`}
                                id={8}
                                Value={item.oclp}
                                Title={t('oclp')}
                                onToggle={handleToggle}
                                Description={t('oclp-desc')}
                                isActive={activeCard === 8}
                            />,
                            <MetricCard
                                key={`${index}-9`}
                                id={9}
                                Value={item.cpr}
                                Title={t('cpr')}
                                onToggle={handleToggle}
                                Description={t('cpr-desc')}
                                isActive={activeCard === 9}
                            />,
                            <MetricCard
                                key={`${index}-10`}
                                id={10}
                                Value={item.atc}
                                Title={t('atc')}
                                onToggle={handleToggle}
                                Description={t('atc-desc')}
                                isActive={activeCard === 10}
                            />,
                            <MetricCard
                                key={`${index}-11`}
                                id={11}
                                Value={item.roas}
                                Title={t('roas')}
                                onToggle={handleToggle}
                                Description={t('roas-desc')}
                                isActive={activeCard === 11}
                            />,
                            <MetricCard
                                key={`${index}-12`}
                                id={12}
                                Value={item.realroas}
                                Title={t('real-roas')}
                                onToggle={handleToggle}
                                Description={t('real-desc')}
                                isActive={activeCard === 12}
                            />,
                        ])
                    }
                </div>
            </div>
        </div>
    );
}
