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

export default function AdminSidebar() {
    const sidebarLink = useRef(null);
    const sideBar = useRef(null);
    const t = useTranslations('admin-sidebar');
    const tout = useTranslations('swal-logout');
    const Router = useRouter();

    const [minimizedSidebar, setMinimizedSidebar] = useState(false);
    const { sidebarHide, setSidebarHide, setChangeTable, userData } = useContext(AdminDashboardContext);

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

    const sidebarItems = [
        {
            key: 'dashboard',
            icon: <FaTachometerAlt size={13} />,
            text: t('dashboard'),
            onClick: () => setChangeTable("dashboard")
        },
        userData.roles === "admin" && {
            key: 'analytics',
            icon: <FaChartLine size={13} />,
            text: t('analytics'),
            link: `/${localStorage.getItem("lang")}/dashboard`,
        },
        userData.roles === "admin" && {
            key: 'tenant-profile',
            icon: <FaBuilding size={13} />,
            text: t('tenant-profile'),
            onClick: () => setChangeTable("company")
        },
        userData.roles === "sadmin" && {
            key: 'tenants',
            icon: <RiBuilding2Fill />,
            text: t('tenants'),
            onClick: () => setChangeTable("tenants")
        },
        {
            key: 'users',
            icon: <RiProfileFill />,
            text: t('users'),
            onClick: () => setChangeTable("users")
        },
        {
            key: 'campaigns',
            icon: <RiMegaphoneFill />,
            text: t('campaigns'),
            onClick: () => setChangeTable("campaigns")
        },
        {
            key: 'accounts',
            icon: <RiAccountBoxFill />,
            text: t('accounts'),
            onClick: () => setChangeTable("accounts")
        },
        {
            key: 'clients',
            icon: <RiEye2Fill />,
            text: t('clients'),
            onClick: () => setChangeTable("clients")
        },
        {
            key: 'profile',
            icon: <RiProfileFill />,
            text: t('profile'),
            link: `/${localStorage.getItem("lang")}/profile`,
        },
        {
            key: 'logout',
            icon: <RiLogoutBoxLine />,
            text: t('logout'),
            onClick: handleLogout
        }
    ];

    return (
        <div className="fixed z-10 bg-slate-800 w-[300px] h-screen text-white transition-transform pe-5" ref={sideBar}>
            <ul className="pt-28 pl-3 uppercase ms-5">
                <li className="mb-4 ms-2 text-slate-400 font-semibold">
                    Menu
                </li>
                {sidebarItems.map(item => item && (
                    <li key={item.key} className="mb-4 text-sm">
                        <button
                            className="flex items-center justify-between w-full px-4 py-2 text-sm rounded-md hover:bg-[#333A48] focus:outline-none focus:bg-[#333A48]"
                            onClick={item.onClick}
                        >
                            <div className="flex items-center gap-2 text-slate-300">
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
