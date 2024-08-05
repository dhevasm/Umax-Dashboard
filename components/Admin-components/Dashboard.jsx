'use client'

import { useState, useEffect, useCallback } from 'react'
import { useContext } from 'react'
import axios from 'axios'
import Image from 'next/image'
import CountCard from './CountCard'
import ChartOne from './Charts/ChartOne'
import ChartTwo from './Charts/ChartTwo'
import ChartThree from './Charts/ChartThree'
import Map from './Maps/Map'
import { AdminDashboardContext } from '@/app/[locale]/admin-dashboard/page'
import { useTranslations } from 'next-intl'

export default function Dashboard({ tenant_id }) {
    const t = useTranslations('admin-dashboard')
    const { userData, dataDashboard, tenantsCount } = useContext(AdminDashboardContext)
    const [campaigns, setCampaigns] = useState([])
    const [filter, setFilter] = useState('reach')

    const getCampaign = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/metric-by-tenant-id?tenantId=${localStorage.getItem('tenantId')}&status=${filter}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            })
            setCampaigns(response.data.Data)
        } catch (error) {
            console.error('Error fetching campaigns:', error)
        }
    }, [filter])

    useEffect(() => {
        getCampaign()
    }, [getCampaign])

    useEffect(() => {
        setFilterCampaign(filter)
    }, [filter])

    const setFilterCampaign = useCallback((filterset) => {
        const sortedCampaigns = [...campaigns].sort((a, b) => {
            const getValue = (data, key) => parseInt(data[key].replace(/\./g, ''))
            switch (filterset) {
                case 'amountspent':
                    return getValue(b, 'amountspent') - getValue(a, 'amountspent')
                case 'reach':
                    return getValue(b, 'reach') - getValue(a, 'reach')
                case 'impressions':
                    return getValue(b, 'impressions') - getValue(a, 'impressions')
                default:
                    return 0
            }
        })
        setCampaigns(sortedCampaigns)
    }, [campaigns])

    const handleFilterChange = (value) => {
        setFilter(value)
    }

    function LoadingCircle() {
        return (
            <div className="flex justify-center items-center h-20">
                <div className="relative">
                    <div className="w-10 h-10 border-4 border-[#1C2434] dark:border-white rounded-full border-t-transparent dark:border-t-transparent animate-spin"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-wrap gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 w-full">
                <CountCard
                    title={t('tenants')}
                    value={userData.roles === 'admin' ? userData.company_name || <div className="text-md animate-pulse">Loading...</div> : tenantsCount || <div className="text-md animate-pulse">Loading...</div>}
                    handleClick={userData.roles === 'admin' ? 'company' : 'tenants'}
                />
                <CountCard title={t('users')} value={dataDashboard.users || <div className="text-md animate-pulse">Loading...</div>} handleClick="users" />
                <CountCard title={t('campaigns')} value={dataDashboard.campaigns || <div className="text-md animate-pulse">Loading...</div>} handleClick="campaigns" />
                <CountCard title={t('clients')} value={dataDashboard.clients || <div className="text-md animate-pulse">Loading...</div>} handleClick="clients" />
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-7 mb-3">
                <div className="w-full lg:w-1/3 h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                    <ChartOne />
                </div>
                <div className="w-full lg:w-2/3 h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                    <ChartTwo />
                </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-7 mb-3">
                <div className="w-full lg:w-3/5 h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                    <Map />
                </div>
                <div className="w-full lg:w-2/5 h-[450px] bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5">
                    <ChartThree />
                </div>
            </div>
            {userData.roles === 'admin' && (
                <div className="w-full h-fit flex flex-col gap-7 mb-3">
                    <div className="w-full h-fit bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5 overflow-y-auto">
                        <div className="rounded-sm bg-white dark:bg-slate-800 shadow-default sm:px-7.5 xl:pb-1">
                            <div className="flex justify-between items-center mb-5">
                                <h4 className="mb-6 text-xl font-semibold text-black dark:text-slate-200">
                                    {t('top-5-campaigns')}
                                </h4>
                                <div className="flex gap-2">
                                    <style>
                                        {`
                                        .filterselect {
                                            background-color: #3d50e0;
                                            color: white;
                                        }
                                        `}
                                    </style>
                                </div>
                            </div>
                            <div className="flex flex-col overflow-y-auto">
                                <div className="grid grid-cols-3 rounded-sm bg-slate-100 sm:grid-cols-5">
                                    <div className="p-2.5 xl:p-5">
                                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                                            {t('campaigns')}
                                        </h5>
                                    </div>
                                    <div className="p-2.5 text-center xl:p-5">
                                        <h5 className={`hover:cursor-pointer text-sm font-medium uppercase xsm:text-base ${filter === 'amountspent' ? 'text-blue-500' : ''}`} onClick={() => handleFilterChange('amountspent')}>
                                            {t('amount-spent')}
                                        </h5>
                                    </div>
                                    <div className="p-2.5 text-center xl:p-5">
                                        <h5 className={`hover:cursor-pointer text-sm font-medium uppercase xsm:text-base ${filter === 'reach' ? 'text-blue-500' : ''}`} onClick={() => handleFilterChange('reach')}>
                                            {t('reach')}
                                        </h5>
                                    </div>
                                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                                        <h5 className={`hover:cursor-pointer text-sm font-medium uppercase xsm:text-base ${filter === 'impressions' ? 'text-blue-500' : ''}`} onClick={() => handleFilterChange('impressions')}>
                                            {t('impressions')}
                                        </h5>
                                    </div>
                                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                                            {t('start-date')}
                                        </h5>
                                    </div>
                                </div>
                                {campaigns.length > 0 ? (
                                    campaigns.slice(0, 5).map((data, index) => (
                                        <div key={index} className="grid grid-cols-3 sm:grid-cols-5 border-b">
                                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                                <div className="flex-shrink-0">
                                                    <Image
                                                        src={`/assets/${data.campaign_platform === 1 ? 'meta.svg' : data.campaign_platform === 2 ? 'google.svg' : data.campaign_platform === 3 ? 'tiktok.svg' : ''}`}
                                                        width={45}
                                                        height={45}
                                                        alt="Logo"
                                                    />
                                                </div>
                                                <p className="hidden text-black dark:text-slate-200 sm:block">
                                                    {data.campaign_name}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                                <p className="text-black dark:text-slate-200">{data.amountspent}</p>
                                            </div>
                                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                                <p className="text-meta-3 dark:text-slate-200">{data.reach}</p>
                                            </div>
                                            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                                <p className="text-meta-5 dark:text-slate-200">{data.impressions}</p>
                                            </div>
                                            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                                <p className="text-black dark:text-slate-200">{data.start_date}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full">
                                        <div className="flex w-full items-center justify-center p-2.5 xl:p-5">
                                            <LoadingCircle />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
