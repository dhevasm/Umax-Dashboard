'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import axios from 'axios';

const Page = () => {
    const [selectTimezone, setSelectTimezone] = useState([]);
    const [selectCulture, setSelectCulture] = useState([]);
    const [selectCurrency, setSelectCurrency] = useState([]);
    const [country, setCountry] = useState([])
    const [city, setCity] = useState([])
    const [alldial, setDial] = useState([])
    const [dialCountry, setDialCountry] = useState([])
    const [showForm, setShowForm] = useState(1);

    useEffect(() => {
        const fetchData = async (url, setState) => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setState(response.data);
            } catch (error) {
                console.error(`Error fetching data from ${url}:`, error.message);
            }
        };

        fetchData(`${process.env.NEXT_PUBLIC_API_URL}/timezone`, setSelectTimezone);
        fetchData(`${process.env.NEXT_PUBLIC_API_URL}/culture`, setSelectCulture);
        fetchData(`${process.env.NEXT_PUBLIC_API_URL}/currency`, setSelectCurrency);
        fetchData(`https://countriesnow.space/api/v0.1/countries`, setCountry);
        fetchData(`https://countriesnow.space/api/v0.1/countries/codes`, setDial);
    }, []);

    async function getCityList(countryname){
        // setValues({...values, country: countryname})
        let citylist = []
        country.data.map((item) => {
            if(item.country == countryname){
                citylist= item.cities
            }
        })
        alldial.data.map((item) => {
            if(item.name == countryname){
                setDialCountry(item.dial_code)
            }
        })

        setCity(citylist)
    }
    
    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        getCityList(selectedCountry);
    };

    return (
        <div className='w-full h-screen'>
            <div className="bg-bg-login w-full h-full flex flex-col justify-center items-center gap-2">
                <Image
                    src="/assets/logo.png"
                    alt="logo"
                    className="mx-auto pb-2 w-20"
                    width={80} 
                    height={10}
                 />
                 <div className='w-10/12 md:w-5/12 p-8 h-fit bg-white rounded-lg shadow-lg border-2'>
                    <p className="font-semibold text-xl text-[#5473E3] mb-5">{showForm == 1 ? 'Buat akun baru' : showForm == 2 ? 'User Company profile' : showForm == 3 ? 'International information' : ''}</p>
                    <form action="">
                        {showForm == 1 && (
                            <>
                                <div className='mb-3'>
                                    <label htmlFor="name">Name<span className='text-red-600'>*</span></label>
                                    <input type="text" id="name" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="email">Email<span className='text-red-600'>*</span></label>
                                    <input type="email" id="email" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="password">Password<span className='text-red-600'>*</span></label>
                                    <input type="password" id="password" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
                                </div>
                                <div className='mb-5'>
                                    <label htmlFor="confirmPassword">Confirm Password<span className='text-red-600'>*</span></label>
                                    <input type="password" id="confirmPassword" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
                                </div>
                            </>
                        )}
                        {showForm == 2 && (
                            <>
                                <div className='mb-3'>
                                    <label htmlFor="company-name">Company<span className='text-red-600'>*</span></label>
                                    <input type="text" id="company-name" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="company-email">Company Email<span className='text-red-600'>*</span></label>
                                    <input type="email" id="company-email" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="address">Address<span className='text-red-600'>*</span></label>
                                    <input type="text" id="address" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
                                </div>
                                <div className='mb-3 flex gap-2'>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="city">Country<span className='text-red-600'>*</span></label>
                                        <select name="country" id="" onChange={handleCountryChange} className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                            <option value="" selected disabled>Select Country</option>
                                            {country.data.map((item, index) => (
                                                <option key={index} value={item.country}>{item.country}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="city">Country<span className='text-red-600'>*</span></label>
                                        <select name="country" id="" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                            <option value="" selected disabled>Select City</option>
                                            {city.length > 0 ? city.map((item, index) => (
                                                <>
                                                    <option key={index} value={item}>{item}</option>
                                                </>
                                            ))
                                            :
                                            <option value="" selected disabled>Loading....</option>
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='mb-5'>
                                    <label htmlFor="contact">Contact<span className='text-red-600'>*</span></label>
                                    <input type="number" id="contact" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
                                </div>
                            </>
                        )}
                        {showForm == 3 && (
                            <>
                                <div className='mb-3'>
                                    <select name="language" id="" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                        <option value="" selected disabled>Select Language</option>
                                        <option value="id">Indonesia</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                                <div className='mb-3'>
                                    <select name="culture" id="" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                        <option value="" selected disabled>Select Culture</option>
                                        {selectCulture.map((item, index) => (
                                            <option key={index} value={item.cultureInfoCode}>{item.country}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='mb-3'>
                                    <select name="timezone" id="" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                        <option value="" selected disabled>Select Timezone</option>
                                        {selectTimezone.map((item, index) => (
                                            <option key={index} value={item.timezone}>{item.timezone}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='mb-3'>
                                    <select name="currency" id="" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                        <option value="" selected disabled>Select Currency</option>
                                        {selectCurrency.map((item, index) => {
                                            const [currencyCode, ...currencyNameParts] = item.currency.split('  -  ');
                                            return (
                                                <option key={index} value={currencyCode.trim()}>
                                                    {item.currency}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className='mb-3'>
                                    <select name="currency_position" id="" className='w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                        <option value="" selected disabled>Select Currency Position</option>
                                        <option value="front">Left ($n)</option>
                                        <option value="back">right (n$)</option>
                                    </select>
                                </div>
                            </>
                        )}
                        <input type="text" value={'admin'} hidden/>
                        <div className='w-full flex justify-end gap-2'>
                            <button type="button" disabled={showForm == 1} onClick={() => setShowForm(showForm - 1)} className='w-[25%] bg-[#5473E3] disabled:bg-[#5473E3]/50 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-250'>Kembali</button>
                            <button type="button" onClick={() => setShowForm(showForm + 1)} className='w-[25%] bg-[#5473E3] text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-250'>Selanjutnya</button>
                        </div>
                    </form>
                 </div>
            </div>
        </div>
    )
}

export default Page