'use client'

import { useState, useContext, useEffect, useRef } from "react";
import { AdminDashboardContext } from "@/app/[locale]/admin-dashboard/page";
import { IconContext } from "react-icons";
import { FaBuilding, FaChartLine, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { RiAccountBoxFill, RiBuilding2Fill, RiProfileFill, RiMegaphoneFill, RiEye2Fill, RiLogoutBoxLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import Link from "next/link";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default function AdminSidebar() {
    const sidebarLink = useRef(null);
    const sideBar = useRef(null);
    const t = useTranslations('admin-sidebar');
    const tout = useTranslations('swal-logout');
    const Router = useRouter();

    const [minimizedSidebar, setMinimizedSidebar] = useState(false);
    const {
        sidebarHide,
        setSidebarHide,
        updateCard,
        setUpdateCard,
        changeTable,
        setChangeTable,
        test,
        dataDashboard,
        isDarkMode,
        setIsDarkMode,
        navbarBrandHide,
        setNavbarBrandHide,
        userData
      } = useContext(AdminDashboardContext);

    useEffect(() => {
        document.querySelector(".sidebaractivelink")?.classList.remove('sidebaractivelink');
        document.querySelector(".sidebaractivelinklight")?.classList.remove('sidebaractivelinklight');
        if(isDarkMode){
            document.getElementById(changeTable)?.classList.add('sidebaractivelink');
        }else{
            document.getElementById(changeTable)?.classList.add('sidebaractivelinklight');
        }
    }, [changeTable])

    useEffect(() => {
        if(isDarkMode){
            document.querySelector(".sidebaractivelinklight")?.classList.add('sidebaractivelink');
            document.querySelector(".sidebaractivelinklight")?.classList.remove('sidebaractivelinklight');
        }else{
            document.querySelector(".sidebaractivelink")?.classList.add('sidebaractivelinklight');
            document.querySelector(".sidebaractivelink")?.classList.remove('sidebaractivelink');
        }
    }, [isDarkMode])

    useEffect(() => {
        if (sidebarHide) {
            sideBar.current.classList.add('-translate-x-full');
        } else {
            sideBar.current.classList.remove('-translate-x-full');
        }
    }, [sidebarHide]);

    const handleSidebarLink = () => {
        setMinimizedSidebar(prev => !prev);
        sidebarLink.current.classList.toggle('hidden');
    };

    const handleLogout = () => {
        Swal.fire({
            title: tout('warn'),
            text: tout('msg'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: tout('yes'),
            cancelButtonText: tout('no'),
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('tenantId');
                localStorage.removeItem('roles');
                localStorage.removeItem('name');
                localStorage.removeItem('lang');
                Router.push(`/`);

            }
        });
    };

    const [dashboardLoading, setDashboardLoading] = useState(false);

    const handleDashboardDirect = () => {
        // toastr.info("Redirecting to Client Dashboard" , "Please Wait!");
        setDashboardLoading(true);
        Router.push(`/${localStorage.getItem("lang")}/dashboard`);
    }

    const sidebarItems = [
        {
            key: 'dashboard',
            id: 'dashboard',
            icon: <FaTachometerAlt size={13} />,
            text: t('dashboard'),
            onClick: () => setChangeTable("dashboard")
        },
        userData.roles === "admin" && {
            key: 'analytics',
            icon: <FaChartLine size={13} />,
            text: `${dashboardLoading ? "Loading..." : t('analytics')}`,
            onClick: () => handleDashboardDirect()
        },
        userData.roles === "admin" && {
            key: 'tenant-profile',
            id: 'company',
            icon: <FaBuilding size={13} />,
            text: t('tenant-profile'),
            onClick: () => setChangeTable("company")
        },
        userData.roles === "sadmin" && {
            key: 'tenants',
            id: 'tenants',
            icon: <RiBuilding2Fill />,
            text: t('tenants'),
            onClick: () => setChangeTable("tenants")
        },
        {
            key: 'users',
            id: 'users',
            icon: <RiProfileFill />,
            text: t('users'),
            onClick: () => setChangeTable("users")
        },
        {
            key: 'campaigns',
            id: 'campaigns',
            icon: <RiMegaphoneFill />,
            text: t('campaigns'),
            onClick: () => setChangeTable("campaigns")
        },
        {
            key: 'accounts',
            id: 'accounts',
            icon: <RiAccountBoxFill />,
            text: t('accounts'),
            onClick: () => setChangeTable("accounts")
        },
        {
            key: 'clients',
            id: 'clients',
            icon: <RiEye2Fill />,
            text: t('clients'),
            onClick: () => setChangeTable("clients")
        },
        {
            key: 'profile',
            icon: <RiProfileFill />,
            text: t('profile'),
            // link: `/${localStorage.getItem("lang")}/profile`,
            onClick: () => setChangeTable("profile")
        },
        {
            key: 'logout',
            icon: <RiLogoutBoxLine />,
            text: t('logout'),
            onClick: handleLogout
        }
    ];

    return (
        <div className="fixed z-10 bg-white dark:bg-slate-800 w-[300px] h-screen text-white transition-transform pe-5" ref={sideBar}>
            <style>
                {
                    `
                        .sidebaractivelink{
                            background-color: #333A48;
                        }
                        .sidebaractivelinklight{
                            background-color: #F1F5F9;
                        }
                    `
                }
            </style>
            <ul className="pt-28 pl-3 uppercase ms-5">
                <li className="mb-4 ms-2 text-slate-400 font-semibold">
                    Menu
                </li>
                {sidebarItems.map(item => item && (
                    <li key={item.key} id={item.id} className="mb-4 text-sm">
                        <button
                            className="flex items-center justify-between w-full px-4 py-2 text-sm  hover:bg-[#F1F5F9] dark:hover:bg-[#333A48] focus:outline-none"
                            onClick={item.onClick}
                        >
                            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                                {item.icon}
                                {item.link ? (
                                    <Link href={item.link}>{item.text}</Link>
                                ) : (
                                    item.text
                                )}
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
