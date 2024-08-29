'use client'

import { useCallback, useEffect, useState } from "react";
import Infocard from "../Card/Infocard";
import SuggestionCard from "../Card/SuggestionCard";
import axios from "axios";
import SuggestionLoding from "../Loading/SuggestionLoding";
import InfoCardLoading from "../Loading/InfoCardLoading";
import Chart from "./Chart";
import Swal from "sweetalert2";
import { useTranslations } from 'next-intl';

export default function Performance({ id, spent, atc }) {
    // Variabel for Metrics
    const [rar, setRar] = useState({});
    const [oclp, setOclp] = useState({})
    const [cpr, setCpr] = useState({})
    const [cpc, setCpc] = useState({})
    const [roas, setRoas] = useState({})
    const [ctr, setCtr] = useState({})
    const [r_roas, setR_roas] = useState({})
    // variable for Suggestion
    const [srar, setsRar] = useState({})
    const [sroas, setsRoas] = useState({})
    const [scpr, setsCpr] = useState({})
    const [scpc, setsCpc] = useState({})
    const [soclp, setsOclp] = useState({})
    const [sctr, setsCtr] = useState({})

    const [dateTime, setDateTime] = useState('');
    const t = useTranslations();
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1060);
    const [selected, setSelected] = useState('week');
    const umaxUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchMetrics = useCallback(async () => {
        if (!id) {
            return;
        }
        try {
            const response = await axios.get(`${umaxUrl}/side-cart?campaign_id=${id}`, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            setRar(response.data.Data[0].rar);
            setOclp(response.data.Data[1].oclp);
            setCpr(response.data.Data[2].cpr);
            setCpc(response.data.Data[3].cpc);
            setRoas(response.data.Data[4].roas);
            setCtr(response.data.Data[5].ctr);
            setR_roas(response.data.Data[6].real_roas);
        } catch (error) {
            console.error(error);
        }
    }, [id, umaxUrl]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    const checkDeviceWidth = () => {
        setIsWideScreen(window.innerWidth >= 1060);
    };

    useEffect(() => {
        window.addEventListener("resize", checkDeviceWidth);
        return () => window.removeEventListener("resize", checkDeviceWidth);
    }, []);

    const fetchSuggestions = useCallback(async () => {
        if (!id) {
            return;
        }
        try {
            const response = await axios.get(`${umaxUrl}/suggestions?campaign_id=${id}&tenantId=${localStorage.getItem('tenant_id')}`, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            })
            setsRar(response.data.Data[0].rar)
            setsRoas(response.data.Data[0].roas)
            setsCpr(response.data.Data[0].cpr)
            setsCpc(response.data.Data[0].cpc)
            setsOclp(response.data.Data[0].oclp)
            setsCtr(response.data.Data[0].ctr)
        } catch (error) {
            console.error(error)
        }
    }, [id, umaxUrl]);

    useEffect(() => {
        fetchSuggestions()
    }, [fetchSuggestions])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user-by-id`;
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    accept: 'application/json',
                },
            });

            let timeZone = ''
            const data = response.data.Data[0];
            if(data.roles === 'client'){
                timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;     
            }
            timeZone = data.timezone_name;
        
            // Membuat objek tanggal dengan zona waktu
            const dateFormatter = new Intl.DateTimeFormat('default', {
            timeZone,
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true, // Jika Anda ingin menampilkan waktu dalam format 12 jam
            });
        
            // Mengatur state dengan tanggal dan waktu yang diformat
            setDateTime(dateFormatter.format(new Date()));
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!id) {
                Swal.fire({
                    icon: 'info',
                    title: t('performence.data-not-appear'),
                    text: t('performence.please-select-campaign'),
                });
            }
        }, 10000); // 10 seconds delay
    
        // Cleanup function to clear the timer if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="w-full">
                {/* Header */}
                <div className="w-full flex items-center justify-end gap-2">
                    <p className="flex items-center">
                        {dateTime}
                    </p>
                    <div className="w-[150px] h-fit flex mb-3">
                        <select
                            className="w-full h-fit px-4 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-lg"
                            value={selected}
                            onChange={(e) => setSelected(e.target.value)}
                        >
                            <option disabled={id === ''} value="week">{t('performence.last-week')}</option>
                            <option disabled={id === ''} value="month">{t('performence.last-month')}</option>
                            <option disabled={id === ''} value="year">{t('performence.last-year')}</option>
                        </select>
                    </div>
                </div>
                {/* Content */}
                <div className="w-full mt-3">
                    {/* Infocard & Chart */}
                    <div className={`flex ${isWideScreen ? 'flex-row' : 'flex-col'} justify-between gap-5`}>
                    {/* Infocard */}
                    <div className={`${isWideScreen ? 'w-[40%]' : 'w-full'} flex flex-col gap-8`}>
                        {id === ''
                        ? Array(4).fill(0).map((_, i) => (
                            <InfoCardLoading key={i} />
                        ))
                        : <>
                            <Infocard 
                            Color='' 
                            Title={t('metric7.amount-spent')} 
                            Value={spent ? spent : ''} 
                            Desc={t('metric7.amount-desc')} 
                            />

                            <Infocard 
                            Color={rar?.color || ''} 
                            Title={t('metric7.reach-amount-spent-ratio')} 
                            Value={rar?.value || ''} 
                            Desc={t('metric7.rar-desc')} 
                            />

                            <Infocard 
                            Color={cpr?.color || ''} 
                            Title={t('metric7.cpr')} 
                            Value={cpr?.value || ''} 
                            Desc={t('metric7.cpr-desc')} 
                            />

                            <Infocard 
                            Color={oclp?.color || ''} 
                            Title={t('metric7.oclp')} 
                            Value={oclp?.value || ''} 
                            Desc={t('metric7.oclp-desc')} 
                            />
                        </>
                        }
                    </div>
                    {/* Chart */}
                    <div className={`${isWideScreen ? 'w-[60%]' : 'w-full'} flex flex-col justify-end flex-wrap`}>
                        <Chart campaignID={id} time={selected} />
                        {/* Infocard 2 */}
                        <div className={`flex ${isWideScreen ? 'flex-row' : 'flex-col'} gap-5`}>
                        {id === ''
                            ? Array(4).fill(0).map((_, i) => (
                            <InfoCardLoading key={i} />
                            ))
                            : <>
                                <Infocard 
                                Color={ctr?.color || ''} 
                                Title={t('metric7.ctr')} 
                                Value={ctr?.value || ''} 
                                Desc={t('metric7.ctr-desc')} 
                                />

                                <Infocard 
                                Color='' 
                                Title={t('metric7.atc')} 
                                Value={atc ? atc : ''} 
                                Desc={t('metric7.atc-desc')} 
                                />

                                <Infocard 
                                Color={roas?.color || ''} 
                                Title={t('metric7.roas')} 
                                Value={roas?.value || ''} 
                                Desc={t('metric7.roas-desc')} 
                                />

                                <Infocard 
                                Color={r_roas?.color || ''} 
                                Title={t('metric7.real-roas')} 
                                Value={r_roas?.value || ''} 
                                Desc={t('metric7.real-desc')} 
                                />
                            </>
                        }
                        </div>
                    </div>
                    </div>
                    {/* Suggestion */}
                    <div className="w-full h-0.5 bg-gray-200 dark:bg-slate-600 my-5"></div>
                    <h1 className="text-xl font-semibold text-black dark:text-white">{t('performence.suggestions')}</h1>
                    {id === '' 
                    ? Array(3).fill(0).map((_, i) => (
                        <SuggestionLoding key={i} />
                    ))
                    : <>
                        <SuggestionCard 
                            Title={srar?.title || ''} 
                            Desc={srar?.msg || ''} 
                            Color={srar?.color || ''} 
                            Value={srar?.value || ''} 
                            Target={srar?.target || ''} 
                            Message={srar?.massage || ''} 
                        />

                        <SuggestionCard 
                            Title={sroas?.title || ''} 
                            Desc={sroas?.msg || ''} 
                            Color={sroas?.color || ''} 
                            Value={sroas?.value || ''} 
                            Target={sroas?.target || ''} 
                            Message={sroas?.message || ''} 
                        />

                        <SuggestionCard 
                            Title={scpr?.title || ''} 
                            Desc={scpr?.msg || ''} 
                            Color={scpr?.color || ''} 
                            Value={scpr?.value || ''} 
                            Target={scpr?.target || ''} 
                            Message={scpr?.message || ''} 
                        />

                        <SuggestionCard 
                            Title={scpc?.title || ''} 
                            Desc={scpc?.msg || ''} 
                            Color={scpc?.color || ''} 
                            Value={scpc?.value || ''} 
                            Target={scpc?.target || ''} 
                            Message={scpc?.message || ''} 
                        />

                        <SuggestionCard 
                            Title={soclp?.title || ''} 
                            Desc={soclp?.msg || ''} 
                            Color={soclp?.color || ''} 
                            Value={soclp?.value || ''} 
                            Target={soclp?.target || ''} 
                            Message={soclp?.massage || ''} 
                        />

                        <SuggestionCard 
                            Title={sctr?.title || ''} 
                            Desc={sctr?.msg || ''} 
                            Color={sctr?.color || ''} 
                            Value={sctr?.value || ''} 
                            Target={sctr?.target || ''} 
                            Message={sctr?.message || ''} 
                        />
                    </>
                    }
                </div>
            </div>

        </>
    );
}
