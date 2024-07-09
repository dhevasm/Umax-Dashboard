'use client'

import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import Link from 'next/link';
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
import LoadingCircle from '@/components/Loading/LoadingCircle';

const Profile = () => {
    const [profileData, setProfileData] = useState({});
    const router = useRouter();

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
            const apiUrl = 'https://umaxxnew-1-d6861606.deta.app/user-by-id';
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

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <div className="w-full bg-white shadow-lg rounded-b-lg overflow-hidden">
                <div className="relative bg-gradient-to-l from-blue-400 to-blue-500 p-6">
                    <div className="absolute top-4 left-4">

                        <button>
                            <IoIosArrowBack className="text-white text-2xl cursor-pointer hover:text-gray-200" onClick={() => router.back()}/>
                        </button>
                    </div>
                    <div className="absolute top-4 right-4">
                        <CiEdit className="text-white text-2xl cursor-pointer hover:text-gray-200" />
                    </div>
                    <div className="flex flex-col items-center mt-10">
                        <div className="w-32 h-32 border-4 border-white rounded-full overflow-hidden">
                            {image ? (
                                <img src={`data:image/png;base64,${image}`} className="object-cover w-full h-full" alt="Profile" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-300 animate-pulse"></div>
                            )}
                        </div>
                        <h1 className="mt-4 text-white text-2xl font-semibold">{name}</h1>
                        <p className="text-white text-lg">{roles}</p>
                    </div>
                </div>
                <div className="p-6">
                    <ProfileSection title="Personal Information">
                        <ProfileItem icon={MdOutlinePermContactCalendar} label="Username" value={name} />
                        <ProfileItem icon={FaUsersCog} label="Roles" value={roles} />
                        <ProfileItem icon={MdOutlineEmail} label="Email" value={email} />
                    </ProfileSection>
                    <ProfileSection title="International">
                        <ProfileItem icon={LiaMoneyBillWaveAltSolid} label="Currencies" value={currency} />
                        <ProfileItem icon={VscSymbolEnum} label="Currency Position" value={currencyPosition} />
                        <ProfileItem icon={CiGlobe} label="Language" value={getLanguageName(language)} flag={getFlagSrc(language)} />
                        <ProfileItem icon={MdOutlineAccessTime} label="Timezone" value={timezoneName} />
                        <ProfileItem icon={GiGlobe} label="Culture" value={culture} />
                    </ProfileSection>
                </div>
            </div>
        </div>
    );
}

const ProfileSection = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const ProfileItem = ({ icon: Icon, label, value, flag }) => (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm w-full">
        <Icon size={24} className="text-blue-500 mr-3" />
        <div>
            <h3 className="text-gray-700 font-medium">{label}</h3>
            <div className='flex gap-2'>
                {flag && <img src={flag} className="w-5 h-5 mt-1" alt="" />}
                <p className="text-gray-500">{value}</p>
            </div>
        </div>
    </div>
);

const getLanguageName = (language) => {
    switch (language) {
        case 'id':
            return 'Indonesia';
        case 'us':
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
        case 'us':
            return '/assets/us.png';
        case 'ja':
            return '/assets/japan.jpg';
        default:
            return '';
    }
};

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
