import { useEffect, useState, useCallback } from "react";
import MetricCard from "../Card/MetricCard";
import axios from "axios";
import MetricsLoading from "../Loading/MetricsLoading";
import { useTranslations } from 'next-intl';

export default function Metrics({ id }) {
    const [activeCard, setActiveCard] = useState(null);
    const [data, setData] = useState([]);
    const [history, setHistory] = useState([]);
    const t = useTranslations('metrics');
    const umaxUrl = process.env.NEXT_PUBLIC_API_URL;

    // Memoize getMetricByCampaign with useCallback
    const getMetricByCampaign = useCallback(async () => {
        if (!id) {
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
    }, [getMetricByCampaign]);

    const getHistoryByCampaign = useCallback(async () => {
        if (!id) {
            console.warn("No campaign ID provided");
            return;
        }

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${umaxUrl}/metrics-7?campaign_id=${id}&tenantId=${localStorage.getItem('tenantId')}`, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setHistory(response.data.Data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    }, [id]);

    useEffect(() => {
        getHistoryByCampaign();
    }, [getHistoryByCampaign]);

    const handleToggle = (id) => {
        setActiveCard(activeCard === id ? null : id);
    };

    const cleanValue = (value) => {
        // Remove the "Rp" prefix if it exists
        value = value.replace(/^Rp\s*/, '');
    
        // Remove the percentage sign and convert to a number
        if (value.includes('%')) {
            return parseFloat(value.replace('%', ''));
        }
    
        // Remove the 'x' sign and convert to a number
        if (value.includes('x')) {
            return parseFloat(value.replace('x', ''));
        }
    
        // Replace periods (.) used as thousand separators with an empty string
        value = value.replace(/\./g, '');
    
        // Replace commas (,) used as decimal separators with a period
        value = value.replace(',', '.');
    
        // Convert the cleaned string to a float
        let number = parseFloat(value) || 0;
    
        // Return as an integer if the number is a whole number (e.g., 1.0 becomes 1)
        return Number.isInteger(number) ? number : number;
    }; 
    
    const calculateMetrics = (metricName) => {
        const values = history.slice(-7).map(item => cleanValue(item[metricName]));
        const total = values.reduce((acc, value) => acc + value, 0);
        const average = total / values.length;
        return {
            total: total.toFixed(1),
            average: average.toFixed(1)
        };
    };
    
    const metricCalculations = {
        amountspent: calculateMetrics('amountspent'),
        reach: calculateMetrics('reach'),
        impressions: calculateMetrics('impressions'),
        frequency: calculateMetrics('frequency'),
        rar: calculateMetrics('rar'),
        cpc: calculateMetrics('cpc'),
        ctr: calculateMetrics('ctr'),
        oclp: calculateMetrics('oclp'),
        cpr: calculateMetrics('cpr'),
        atc: calculateMetrics('atc'),
        roas: calculateMetrics('roas'),
        realroas: calculateMetrics('realroas')
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
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.amountspent)
                                }))}
                                totalSpent={metricCalculations.amountspent.total}
                                averageSpent={metricCalculations.amountspent.average}
                            />,
                            <MetricCard
                                key={`${index}-2`}
                                id={2}
                                Value={item.reach}
                                Title={t('reach')}
                                onToggle={handleToggle}
                                Description={t('reach-desc')}
                                isActive={activeCard === 2}
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.reach)
                                }))}
                                totalSpent={metricCalculations.reach.total}
                                averageSpent={metricCalculations.reach.average}
                            />,
                            <MetricCard
                                key={`${index}-3`}
                                id={3}
                                Value={item.impressions}
                                Title={t('impressions')}
                                onToggle={handleToggle}
                                Description={t('impressions-desc')}
                                isActive={activeCard === 3}
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.impressions)
                                }))}
                                totalSpent={metricCalculations.impressions.total}
                                averageSpent={metricCalculations.impressions.average}
                            />,
                            <MetricCard
                                key={`${index}-4`}
                                id={4}
                                Value={item.frequency}
                                Title={t('frequency')}
                                onToggle={handleToggle}
                                Description={t('frequency-desc')}
                                isActive={activeCard === 4}
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.frequency)
                                }))}
                                totalSpent={metricCalculations.frequency.total}
                                averageSpent={metricCalculations.frequency.average}
                            />,
                            <MetricCard
                                key={`${index}-5`}
                                id={5}
                                Value={item.rar}
                                Title={t('rar')}
                                onToggle={handleToggle}
                                Description={t('rar-desc')}
                                isActive={activeCard === 5}
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.rar)
                                }))}
                                totalSpent={metricCalculations.rar.total}
                                averageSpent={metricCalculations.rar.average}
                            />,
                            <MetricCard
                                key={`${index}-6`}
                                id={6}
                                Value={item.cpc}
                                Title={t('cpc')}
                                onToggle={handleToggle}
                                Description={t('cpc-desc')}
                                isActive={activeCard === 6}
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.cpc)
                                }))}
                                totalSpent={metricCalculations.cpc.total}
                                averageSpent={metricCalculations.cpc.average}
                            />,
                            <MetricCard
                                key={`${index}-7`}
                                id={7}
                                Value={item.ctr}
                                Title={t('ctr')}
                                onToggle={handleToggle}
                                Description={t('ctr-desc')}
                                isActive={activeCard === 7}
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.ctr)
                                }))}
                                totalSpent={metricCalculations.ctr.total}
                                averageSpent={metricCalculations.ctr.average}
                            />,
                            <MetricCard
                                key={`${index}-8`}
                                id={8}
                                Value={item.oclp}
                                Title={t('oclp')}
                                onToggle={handleToggle}
                                Description={t('oclp-desc')}
                                isActive={activeCard === 8}
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.oclp)
                                }))}
                                totalSpent={metricCalculations.oclp.total}
                                averageSpent={metricCalculations.oclp.average}
                            />,
                            <MetricCard
                                key={`${index}-9`}
                                id={9}
                                Value={item.cpr}
                                Title={t('cpr')}
                                onToggle={handleToggle}
                                Description={t('cpr-desc')}
                                isActive={activeCard === 9}
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.cpr)
                                }))}
                                totalSpent={metricCalculations.cpr.total}
                                averageSpent={metricCalculations.cpr.average}
                            />,
                            <MetricCard
                                key={`${index}-10`}
                                id={10}
                                Value={item.atc}
                                Title={t('atc')}
                                onToggle={handleToggle}
                                Description={t('atc-desc')}
                                isActive={activeCard === 10}
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.atc)
                                }))}
                                totalSpent={metricCalculations.atc.total}
                                averageSpent={metricCalculations.atc.average}
                            />,
                            <MetricCard
                                key={`${index}-11`}
                                id={11}
                                Value={item.roas}
                                Title={t('roas')}
                                onToggle={handleToggle}
                                Description={t('roas-desc')}
                                isActive={activeCard === 11}
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.roas)
                                }))}
                                totalSpent={metricCalculations.roas.total}
                                averageSpent={metricCalculations.roas.average}
                            />,
                            <MetricCard
                                key={`${index}-12`}
                                id={12}
                                Value={item.realroas}
                                Title={t('real-roas')}
                                onToggle={handleToggle}
                                Description={t('real-desc')}
                                isActive={activeCard === 12}
                                data={history.slice(-7).map((item, index) => ({
                                    name: `Metric ${index + 1}`,
                                    value: cleanValue(item.realroas)
                                }))}
                                totalSpent={metricCalculations.realroas.total}
                                averageSpent={metricCalculations.realroas.average}
                            />,
                        ])
                    }
                </div>
            </div>
        </div>
    );
}
