'use client'

import { useEffect, useState } from "react";
import Infocard from "../Card/Infocard";
import SuggestionCard from "../Card/SuggestionCard";
import axios from "axios";
import SuggestionLoding from "../Loading/SuggestionLoding";
import InfoCardLoading from "../Loading/InfoCardLoading";
import Chart from "./Chart";

export default function Performance({ id }) {
    // Variabel for Metrics
    const [metrics, setMetrics] = useState([])
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

    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1060);
    const [selected, setSelected] = useState('week');
    const umaxUrl = 'https://umaxxnew-1-d6861606.deta.app';

    const fetchMetrics = async () => {
        if (!id) {
            console.warn('No campaign ID provided');
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
    };

    useEffect(() => {
        fetchMetrics();
    }, [id]);

    const checkDeviceWidth = () => {
        setIsWideScreen(window.innerWidth >= 1060);
    };

    useEffect(() => {
        window.addEventListener("resize", checkDeviceWidth);
        return () => window.removeEventListener("resize", checkDeviceWidth);
    }, []);

    const fetchSuggestions = async () => {
        if (!id) {
            console.warn('No campaign ID provided');
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
    }

    useEffect(() => {
        fetchSuggestions()
    }, [id])

    return (
        <>
            <div className="w-full">
                {/* Header */}
                <div className="w-full flex items-center justify-end">
                    <div className="w-[150px] h-fit flex mb-3 me-1">
                        {new Date().toLocaleString('default', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    </div>
                    <div className="w-[150px] h-fit flex mb-3 me-3">
                    <select
                        className="w-full h-fit px-4 py-2 border-2 border-gray-300 rounded-lg"
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        <option disabled={id === ''} value="week">Last Week</option>
                        <option disabled={id === ''} value="month">Last Month</option>
                        <option disabled={id === ''} value="year">Last Year</option>
                    </select>
                    </div>
                </div>
                {/* Content */}
                <div className="w-full mt-3">
                    {/* Infocard & Chart */}
                    <div className={`flex ${isWideScreen ? 'flex-row' : 'flex-col'} justify-between gap-5`}>
                        {/* Infocard */}
                        <div className={`${isWideScreen ? 'w-[40%]' : 'w-full'}  flex flex-col gap-8`}>
                            {id == '' 
                            ? 
                            Array(4).fill(0).map((_, i) => (
                                <InfoCardLoading key={i} />
                            ))
                            : 
                            <>
                                <Infocard Color='' Title={'Amount Spent' }Value='Rp 2000.000' Desc='Desc' />
                                <Infocard Color={rar.color} Title={'Reach Amount Spent Ratio'} Value={rar.value} Desc={rar.target} />
                                <Infocard Color={cpr.color} Title={'CPR'} Value={cpr.value} Desc={cpr.target} />
                                <Infocard Color={oclp.color} Title={'OCLP'} Value={oclp.value} Desc={oclp.target} />
                            </>
                            }
                        </div>
                        {/* Chart */}
                        <div className={`${isWideScreen ? 'w-[60%]' : 'w-full'} flex flex-col justify-end flex-wrap`}>
                            <Chart campaignID={id} time={selected}/>
                            {/* Inforcard 2 */}
                            <div className={`flex ${isWideScreen ? 'flex-row' : 'flex-col'} gap-5`}>
                                {id == '' 
                                ? 
                                Array(4).fill(0).map((_, i) => (
                                    <InfoCardLoading key={i} />
                                ))
                                : 
                                <>
                                    <Infocard Color={ctr.color} Title={'CTR'} Value={ctr.value} Desc={ctr.target} />
                                    <Infocard Color='' Title={'ATC'} Value={'180%'} Desc={'Decs'} />
                                    <Infocard Color={roas.color} Title={'ROAS'} Value={roas.value} Desc={roas.target} />
                                    <Infocard Color={r_roas.color} Title={'Real ROAS'} Value={r_roas.value} Desc={r_roas.target} />
                                </>
                                }
                            </div>
                        </div>
                    </div>
                    {/* Suggestion */}
                    <div className="w-full h-0.5 bg-white my-5"></div>
                    <h1 className="text-xl font-semibold">Suggestions</h1>
                    {id == '' ? 
                    Array(3).fill(0).map((_, i) => (
                        <SuggestionLoding key={i}/>
                    ))
                    : 
                        <>
                            <SuggestionCard Title={srar.title || ''} Desc={srar.msg} Color={srar.color || ''} Value={srar.value || ''} Target={srar.target || ''} Message={srar.message || ''} />
                            <SuggestionCard Title={sroas.title || ''} Desc={sroas.msg} Color={sroas.color || ''} Value={sroas.value || ''} Target={sroas.target || ''} Message={sroas.message || ''} />
                            <SuggestionCard Title={scpr.title || ''} Desc={scpr.msg} Color={scpr.color || ''} Value={scpr.value || ''} Target={scpr.target || ''} Message={scpr.message || ''} />
                            <SuggestionCard Title={scpc.title || ''} Desc={scpc.msg} Color={scpc.color || ''} Value={scpc.value || ''} Target={scpc.target || ''} Message={scpc.message || ''} />
                            <SuggestionCard Title={soclp.title || ''} Desc={soclp.msg} Color={soclp.color || ''} Value={soclp.value || ''} Target={soclp.target || ''} Message={soclp.message} />
                            <SuggestionCard Title={sctr.title || ''} Desc={sctr.msg} Color={sctr.color || ''} Value={sctr.value || ''} Target={sctr.target || ''} Message={sctr.message || ''} />
                        </>
                    }
                </div>
            </div>
        </>
    );
}
