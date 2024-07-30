'use client'

import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { CiGlobe, CiEdit } from 'react-icons/ci';
import axios from 'axios';
import { MdOutlinePermContactCalendar, MdOutlineAccessTime, MdOutlineEmail } from 'react-icons/md';
import { VscSymbolEnum } from 'react-icons/vsc';
import { LiaMoneyBillWaveAltSolid } from 'react-icons/lia';
import { GiGlobe } from 'react-icons/gi';
import { FaUsersCog } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const Profile = () => {
    const [profileData, setProfileData] = useState({});
    const router = useRouter();
    const role = localStorage.getItem('roles');
    const t = useTranslations('profile')

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            Swal.fire('You Must Login First', 'Nice Try!', 'error').then(() => {
                router.back();
            });
        }
    }, [router]);

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

            const data = response.data.Data[0];
            setProfileData({
                name: data.name,
                image: data.image,
                roles: data.roles,
                email: data.email,
                currency: data.currency,
                currencyPosition: data.currency_position,
                language: data.language,
                timezoneName: data.timezone_name,
                culture: data.culture,
            });
            console.log(data.currency);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const {
        name, image, roles, email,
        currency, currencyPosition,
        language, timezoneName, culture
    } = profileData;

    useEffect(() => {
       if(localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            document.getElementById("theme").checked = true
            localStorage.setItem('color-theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            document.getElementById("theme").checked = false
            localStorage.setItem('color-theme', 'light')
        }
    }, [])

    function handleTheme(){
        document.documentElement.classList.toggle("dark")
        localStorage.setItem('color-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
            <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-b-lg overflow-hidden">
                <div className="relative bg-gradient-to-l from-blue-400 to-blue-500 p-6 dark:from-gray-700 dark:to-gray-800">
                    <div className="absolute top-4 left-4">
                        <button>
                            <IoIosArrowBack className="text-white text-2xl cursor-pointer hover:text-gray-200" onClick={() => router.back()} />
                        </button>
                    </div>
                    {role != 'client' && (
                        <div className="absolute top-4 right-4">
                            <a href={`profile/edit`}>
                                <CiEdit className="text-white text-2xl cursor-pointer hover:text-gray-200" />
                            </a>
                        </div>
                    )}
                    <div className="flex flex-col items-center mt-10">
                        <label htmlFor="theme" className="items-center cursor-pointer hidden">
                            <input type="checkbox" value="" id="theme" name="theme" className="sr-only peer" onChange={handleTheme} />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                            </div>
                        </label>
                        <div className="w-32 h-32 border-4 border-white rounded-full overflow-hidden">
                            {image ? (
                                <Image src={`data:image/png;base64,${image}`} className="object-cover w-full h-full" width={128} height={128} alt="Profile" />
                            ) : (
                                <Image src={'/assets/defaultProfil.jpg'} width={128} height={128} alt='Profile'/>
                            )}
                        </div>
                        <h1 className="mt-4 text-white text-2xl font-semibold">{name}</h1>
                        <p className="text-white text-lg">{roles}</p>
                    </div>
                </div>
                <div className={`p-6 dark:text-gray-200`}>
                    <ProfileSection title="Personal Information">
                        <ProfileItem icon={MdOutlinePermContactCalendar} label={t('username')} value={name} />
                        <ProfileItem icon={MdOutlineEmail} label={t('email')} value={email} />
                        {role != 'client' && <ProfileItem icon={FaUsersCog} label={t('role')} value={roles} />}
                    </ProfileSection>
                    {role != 'client' && (
                        <ProfileSection title="International">
                            <ProfileItem icon={LiaMoneyBillWaveAltSolid} label={t('currencies')} value={currency} />
                            <ProfileItem icon={VscSymbolEnum} label={t('currency_position')} value={currencyPosition ? 'Left ($n)' : 'Right (n$)'} />
                            <ProfileItem icon={CiGlobe} label={t('language')} value={getLanguageName(language)} flag={getFlagSrc(language)} />
                            <ProfileItem icon={MdOutlineAccessTime} label={t('timezone')} value={timezoneName} />
                            <ProfileItem icon={GiGlobe} label={t('culture')} value={culture} />
                        </ProfileSection>
                    )}
                </div>
            </div>
        </div>
    );
}

const ProfileSection = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const ProfileItem = ({ icon: Icon, label, value, flag }) => (
    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm w-full">
        <Icon size={24} className="text-blue-500 dark:text-blue-400 mr-3" />
        <div>
            <h3 className="text-gray-700 dark:text-gray-300 font-medium">{label}</h3>
            <div className="flex gap-2">
                {flag && <Image src={flag} className="w-5 h-5 mt-1" width={20} height={20} alt="" />}
                <p className="text-gray-500 dark:text-gray-400">{value}</p>
            </div>
        </div>
    </div>
);

const getLanguageName = (language) => {
    switch (language) {
        case 'id':
            return 'Indonesia';
        case 'en':
            return 'English';
        case 'ja':
            return 'Japanese';
        default:
            return '';
    }
};

const getFlagSrc = (language) => {
    switch (language) {
        case 'id':
            return '/assets/indonesia.png';
        case 'en':
            return '/assets/us.png';
        case 'ja':
            return '/assets/japan.jpg';
        default:
            return '';
    }
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
