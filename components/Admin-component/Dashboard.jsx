'use client'

import CountCard from "./CountCard"
import ChartOne from "./Chart/ChartOne"
import ChartTwo from "./Chart/ChartTwo"
import ChartThree from "./Chart/ChartThree"
import Map from "./Maps/Map"
import Image from "next/image"
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi"
import { useContext } from "react"
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page"
import { useState, useEffect } from "react"
import LoadingCircle from "../Loading/LoadingCircle"
import { useTranslations } from "next-intl"

export default function Dashboard({ tenant_id }) {

    const t = useTranslations("admin-dashboard")
    const { sidebarHide, setSidebarHide, updateCard, setUpdateCard, changeTable, setChangeTable, userData, dataDashboard } = useContext(AdminDashboardContext)

    return (
        <>
            <div className="w-full h-full flex flex-wrap gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 w-full">
                    {userData.roles == "admin" ? <CountCard title={t('tenants')} value={userData.company_name ? userData.company_name : <div className="text-md animate-pulse">Loading...</div>} handleClick={"company"} /> :

                        userData.roles == "sadmin" ? <CountCard title={t('tenants')} value={dataDashboard.tenants ? dataDashboard.tenants : <div className="text-md animate-pulse">Loading...</div>} handleClick={"tenants"} /> :

                            <CountCard title={t('tenants')} value={<div className="text-md animate-pulse">Loading...</div>} />}

                    <CountCard title={t('users')} value={dataDashboard.users ? dataDashboard.users : <div className="text-md animate-pulse">Loading...</div>} handleClick={"users"} />

                    <CountCard title={t('campaigns')} value={dataDashboard.campaigns ? dataDashboard.campaigns : <div className="text-md animate-pulse">Loading...</div>} handleClick={"campaigns"} />
                    <CountCard title={t('clients')} value={dataDashboard.clients ? dataDashboard.clients : <div className="text-md animate-pulse">Loading...</div>} handleClick={"clients"} />
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
                <div className="w-full h-fit flex flex-col gap-7 mb-3">
                    <div className="w-full h-fit bg-white dark:bg-slate-800 rounded-sm shadow-lg p-5 overflow-y-auto">
                        <div className="rounded-sm bg-white dark:bg-slate-800 shadow-default sm:px-7.5 xl:pb-1">
                            <div className="flex justify-between items-center mb-5">
                                <h4 className="mb-6 text-xl font-semibold text-black">
                                    Top Channels
                                </h4>
                                <div className="flex gap-2">
                                    <button className="rounded-full bg-slate-100 px-3 py-2"><BiSolidLeftArrow className="text-slate-600" /></button>
                                    <button className="rounded-full bg-slate-100 px-3 py-2"><BiSolidRightArrow className="text-slate-600" /></button>
                                </div>
                            </div>

                            <div className="flex flex-col overflow-y-auto">
                                <div className="grid grid-cols-3 rounded-sm bg-slate-100 sm:grid-cols-5">
                                    <div className="p-2.5 xl:p-5">
                                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                                            Source
                                        </h5>
                                    </div>
                                    <div className="p-2.5 text-center xl:p-5">
                                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                                            Visitors
                                        </h5>
                                    </div>
                                    <div className="p-2.5 text-center xl:p-5">
                                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                                            Revenues
                                        </h5>
                                    </div>
                                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                                            Sales
                                        </h5>
                                    </div>
                                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                                            Conversion
                                        </h5>
                                    </div>
                                </div>

                                <div className={`grid grid-cols-3 sm:grid-cols-5 border-b`}>
                                    <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                        <div className="flex-shrink-0">
                                            <Image src="https://react-demo.tailadmin.com/assets/brand-01-10b0313f.svg" alt="Brand" width={48} height={48} />
                                        </div>
                                        <p className="hidden text-black sm:block">
                                            Google
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black">5K</p>
                                    </div>

                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-meta-3">$5000</p>
                                    </div>

                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <p className="text-black">590</p>
                                    </div>

                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <p className="text-meta-5">8%</p>
                                    </div>
                                </div>
                                <div className={`grid grid-cols-3 sm:grid-cols-5 border-b`}>
                                    <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                        <div className="flex-shrink-0">
                                            <Image src="https://react-demo.tailadmin.com/assets/brand-01-10b0313f.svg" alt="Brand" width={48} height={48} />
                                        </div>
                                        <p className="hidden text-black sm:block">
                                            Google
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black">5K</p>
                                    </div>

                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-meta-3">$5000</p>
                                    </div>

                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <p className="text-black">590</p>
                                    </div>

                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <p className="text-meta-5">8%</p>
                                    </div>
                                </div>
                                <div className={`grid grid-cols-3 sm:grid-cols-5 border-b`}>
                                    <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                        <div className="flex-shrink-0">
                                            <Image src="https://react-demo.tailadmin.com/assets/brand-01-10b0313f.svg" alt="Brand" width={48} height={48} />
                                        </div>
                                        <p className="hidden text-black sm:block">
                                            Google
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black">5K</p>
                                    </div>

                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-meta-3">$5000</p>
                                    </div>

                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <p className="text-black">590</p>
                                    </div>

                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <p className="text-meta-5">8%</p>
                                    </div>
                                </div>
                                <div className={`grid grid-cols-3 sm:grid-cols-5 border-b`}>
                                    <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                        <div className="flex-shrink-0">
                                            <Image src="https://react-demo.tailadmin.com/assets/brand-01-10b0313f.svg" alt="Brand" width={48} height={48} />
                                        </div>
                                        <p className="hidden text-black sm:block">
                                            Google
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black">5K</p>
                                    </div>

                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-meta-3">$5000</p>
                                    </div>

                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <p className="text-black">590</p>
                                    </div>

                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <p className="text-meta-5">8%</p>
                                    </div>
                                </div>
                                <div className={`grid grid-cols-3 sm:grid-cols-5 border-b`}>
                                    <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                        <div className="flex-shrink-0">
                                            <Image src="https://react-demo.tailadmin.com/assets/brand-01-10b0313f.svg" alt="Brand" width={48} height={48} />
                                        </div>
                                        <p className="hidden text-black sm:block">
                                            Google
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black">5K</p>
                                    </div>

                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-meta-3">$5000</p>
                                    </div>

                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <p className="text-black">590</p>
                                    </div>

                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <p className="text-meta-5">8%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
