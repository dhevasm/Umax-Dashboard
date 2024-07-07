'use client'

import React, { useEffect, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io';
import Link from 'next/link';
import { CiGlobe, CiEdit } from 'react-icons/ci';
import axios from 'axios';  
import { MdOutlinePermContactCalendar, MdOutlineAccessTime, MdOutlineEmail } from 'react-icons/md';
import { VscSymbolEnum } from 'react-icons/vsc';
import { LiaMoneyBillWaveAltSolid } from 'react-icons/lia';
import { GiGlobe } from 'react-icons/gi'
import { FaUsersCog } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';

const Page = () => {
    const [name, setName] = useState('')
    const [image, setimage] = useState('')
    const [roles, setroles] = useState('')
    const [email, setemail] = useState('')
    const [currency, setcurrency] = useState('')
    const [currency_position, setcurrency_position] = useState('')
    const [language, setlanguage] = useState('')
    const [timezone_name, settimezone_name] = useState('')
    const [culture, setculture] = useState('')

    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
        Swal.fire('You Must Login First', 'Nice Try!', 'error').then(() => {
            router.push('/');
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

            setName(response.data.Data.map(item => item.name))
            setimage(response.data.Data.map(item => item.image))
            setroles(response.data.Data.map(item => item.roles))
            setemail(response.data.Data.map(item => item.email))
            setcurrency(response.data.Data.map(item => item.currency))
            setcurrency_position(response.data.Data.map(item => item.currency_position))
            setlanguage(response.data.Data.map(item => item.language))
            settimezone_name(response.data.Data.map(item => item.timezone_name))
            setculture(response.data.Data.map(item => item.culture))

            // console.log(response.data.Data); // Update state with fetched data
        } catch (error) {
            console.error('Error saat mengambil data:', error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const checkDeviceWidth = () => {
        const width = window.innerWidth;
        if (width <= 1020) {
            return true
        } else {
            return false;
        }
    };
    const className = `${checkDeviceWidth() ? 'flex-col' : ''}`;
    console.log(className)

    return (
        <>
            <div className='w-full h-screen'>
                <div className='w-full h-fit shadow-md'>
                    <div className='w-full h-52 flex flex-col bg-gradient-to-l from-blue-400 to-blue-500 rounded-b-3xl'>
                        <div className='w-full h-[25%] flex justify-between items-center p-3'>
                            <Link href="/dashboard">
                                <IoIosArrowBack className='text-gray-50/90 cursor-pointer hover:text-white h-6 w-6'/>
                            </Link>
                            <h1 className='font-semibold text-lg text-gray-50/90 cursor-pointer hover:text-white h-6 w-6'>Profile</h1>
                            <Link href="">
                                <CiEdit className='text-gray-50/90 cursor-pointer hover:text-white h-6 w-6'/>
                            </Link>
                        </div>
                        <div className='w-full h-[75%] flex items-center p-6'>
                            <div className='w-28 h-28 border border-white/10 bg-white/10 rounded-full'>
                                <img src={`data:image/png;base64, ${image}`} className='object-cover rounded-full' alt="" />
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex flex-col md:h-80 h-fit p-6'>
                        <div className='w-full flex flex-col items-center space-x-2'>
                            <div className='w-full flex items-center space-x-2'>
                                <h1 className='text-blue-600 font-medium'>Profile</h1>
                                <hr className='relative w-full border-dashed border-gray-500'/>
                            </div>
                            <div className={`w-full p-5 md:p-10 flex md:flex-row flex-col md:gap-56 gap-3 justify-start`}>
                                <div className='flex gap-2 items-center'>
                                    <MdOutlinePermContactCalendar size={18} className='text-amber-500'/><h1>Username: {name}</h1>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <FaUsersCog size={18} className='text-blue-400'/><h1>Roles: {roles}</h1>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <MdOutlineEmail size={18} className='text-red-400'/><h1>Email: {email}</h1>
                                </div>
                            </div>
                        </div>
                        <div className={`w-full h-fit flex flex-col items-center space-x-2`}>
                            <div className='w-full flex items-center space-x-2'>
                                <h1 className='text-blue-600 font-medium'>International</h1>
                                <hr className='relative w-full border-dashed border-gray-500'/>
                            </div>
                            <div className='w-full md:ps-10 ps-5 pt-5 pb-5 flex md:flex-row flex-col md:gap-52 gap-3 justify-start'>
                                <div className='flex gap-2 items-center'>
                                    <LiaMoneyBillWaveAltSolid size={18} className={`text-green-500`} /><h1 className={`${currency ? 'pe-12' : 'p-0'}`}>Currencies: {currency}</h1>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <VscSymbolEnum size={18} className='text-gray-600'/><h1>Posotion Symbol: {currency_position}</h1>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <CiGlobe size={18} className='text-blue-500'/><h1>Language: </h1>
                                    <img src={`${language == 'id' ? '../assets/indonesia.png'
                                    : language == 'us' ? '../assets/us.png'
                                    : language == 'ja' ? '../assets/japan.jpg' 
                                    : null}`} className='w-4 h-4 object-cover'/>
                                    <h1>{language == 'id' ? 'Indonesia'
                                    : language == 'us' ? 'English' 
                                    : language == 'ja' ? 'Japan' 
                                    : null}</h1>
                                </div>
                                <div className='md:hidden flex gap-2 items-center'>
                                    <MdOutlineAccessTime size={18} className='text-cyan-500'/><h1>Timezone: {timezone_name}</h1>
                                </div>
                                <div className='md:hidden flex gap-2 items-center'>
                                    <GiGlobe size={18} className='text-green-500'/><h1>Culture: {`${culture}`}</h1>
                                </div>
                            </div>
                            <div className='w-full hidden md:ps-10 ps-5 md:pt-5 md:flex md:flex-row flex-col gap-2 md:gap-52 justify-start'>
                                <div className='flex gap-2 items-center'>
                                    <MdOutlineAccessTime size={18} className='text-cyan-500'/><h1>Timezone: {timezone_name}</h1>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <GiGlobe size={18} className='text-green-500'/><h1>Culture: {culture}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default dynamic(() => Promise.resolve(Page), { ssr: false });