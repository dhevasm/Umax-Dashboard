'use client';

import React, { use, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import { BiHome } from 'react-icons/bi';
import * as yup from 'yup';
import { useTranslations } from 'next-intl';
import { Router } from 'react-router-dom';
import Image from 'next/image';

const EditProfile = () => {
    const [selectTimezone, setSelectTimezone] = useState([]);
    const [selectCulture, setSelectCulture] = useState([]);
    const [selectCurrency, setSelectCurrency] = useState([]);
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations('profile');
    const [role,setRole] = useState('') 

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

        fetchData('https://umaxxnew-1-d6861606.deta.app/timezone', setSelectTimezone);
        fetchData('https://umaxxnew-1-d6861606.deta.app/culture', setSelectCulture);
        fetchData('https://umaxxnew-1-d6861606.deta.app/currency', setSelectCurrency);
    }, []);

    useEffect(() => {
        const fetchProfileData = async () => {
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
                setRole(data.roles)
            } catch (error) {
                console.error('Error fetching profile data:', error.message);
            }
        };

        fetchProfileData();
    }, []);

    const validationSchema = yup.object().shape({
        image: yup.string().required('Image is Required'),
        name: yup
          .string()
          .required(t('name-error')),
        email: yup.string().required(t('email-error')).email(t('email-error2')),
        culture: yup.string().required(t('culture-error')),
        input_timezone: yup.string().required(t('timezone-error')),
        currency: yup.string().required(t('currency-error')),
        currency_position: yup.string().required(t('currency-position-error')),
    });
      

    const formik = useFormik({
        initialValues: {
            image: profileData.image || '',
            name: profileData.name || '',
            email: profileData.email || '',
            language: profileData.language || '',
            culture: profileData.culture || '',
            input_timezone: profileData.timezoneName || '',
            currency: profileData.currency || '',
            currency_position: profileData.currencyPosition ? 'front' : 'back',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const token = localStorage.getItem('jwtToken');
                const apiUrl = 'https://umaxxnew-1-d6861606.deta.app/profile';
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('email', values.email);
                formData.append('language', values.language);
                formData.append('culture', values.culture);
                formData.append('input_timezone', values.input_timezone);
                formData.append('currency', values.currency);
                formData.append('currency_position', values.currency_position === 'front' ? true : false);
                if (values.image && values.image instanceof File) {
                    formData.append('image', values.image);
                }
                await axios.put(apiUrl, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setLoading(false)
                if(localStorage.getItem('lang') !== values.language){
                    localStorage.setItem("lang", values.language)
                    Swal.fire({
                        title: "Profile updated successfully!",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Refresh Page!"
                      }).then((result) => {
                        if (result.isConfirmed) {
                            router.push(`/${localStorage.getItem('lang')}/profile/edit`);
                        }
                      });
                }else{
                    alertNotif('Profile updated successfully!');
                }

            } catch (error) {
                console.error('Error updating profile:', error.message);
                setLoading(false)
                alertNotif('Failed to update profile.');
            }
        },
    });

    
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

    function LoadingCircle(){
        return(
            <div className="flex justify-center items-center h-8">
                <div className="relative">
                    <div className="w-8 h-8 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                </div>
            </div>
        )
    }

    function alertNotif(message) {
        Swal.fire({title: 'Success', text: message, icon: 'success'});
    }

    function alertError(message) {
        Swal.fire({title: 'Error', text: message, icon: 'error'});
    }

    let lang = localStorage.getItem('lang');

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
            <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-b-lg overflow-hidden">
                <div className="relative bg-gradient-to-l from-blue-400 to-blue-500 p-6 dark:from-gray-700 dark:to-gray-800">
                    <div className="absolute top-4 left-4">
                        <button>
                            <IoIosArrowBack className="text-white text-2xl cursor-pointer hover:text-gray-200" onClick={() => router.back()} />
                        </button>
                    </div>
                    <div className="absolute top-4 right-4">
                        {
                            role === 'admin' || role === 'sadmin' ? (
                                <a href={`/${lang}/admin-dashboard`}>
                                    <BiHome className="text-white text-2xl cursor-pointer hover:text-gray-200" />
                                </a>
                            ) : <a href={`/${lang}/dashboard`}>
                            <BiHome className="text-white text-2xl cursor-pointer hover:text-gray-200" />
                        </a>
                        }
                        
                    </div>
                    <div className="flex flex-col items-center mt-10">
                        <label htmlFor="theme" className="items-center cursor-pointer hidden">
                            <input type="checkbox" value="" id="theme" name="theme" className="sr-only peer" onChange={handleTheme} />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                            </div>
                        </label>
                        <div className="w-32 h-32 border-4 border-white rounded-full overflow-hidden">
                            {formik.values.image ? (
                                <Image src={`data:image/png;base64, ${profileData.image}`} className="object-cover w-full h-full" width={128} height={128} alt="Profile" />
                            ) : (
                                <Image src={'/assets/defaultProfil.jpg'} width={128} height={128} alt='Profile'/>
                            )}
                        </div>
                        <h1 className="mt-4 text-white text-2xl font-semibold">{formik.values.name}</h1>
                        <p className="text-white text-lg">{profileData.roles}</p>
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit} className="p-6 dark:text-gray-200">
                    <ProfileSection title={t('edit-personal-information')}>
                        {/* <ProfileItem
                            icon="image"
                            label="Profile Picture"
                            element={
                                <input
                                    type="file"
                                    className="border w-full p-2 rounded-lg dark:bg-gray-700"
                                    onChange={(event) => formik.setFieldValue("image", event.currentTarget.files[0])}
                                    name="image"
                                />
                            }
                            error={formik.errors.image}
                        /> */}
                        <ProfileItem
                            icon="user"
                            label={formik.errors.name ? (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('username')}<span className='text-red-600'>*</span></label>
                            ) : (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('username')}</label>
                            )}
                            element={
                                <input
                                    type="text"
                                    className="border w-full p-2 rounded-lg dark:bg-gray-700"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    name="name"
                                    placeholder={t('holder-name')}
                                />
                            }
                            error={formik.errors.name}
                        />
                        <ProfileItem
                            icon="email"
                            label={formik.errors.email ? (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('email')}<span className='text-red-600'>*</span></label>
                            ) : (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('email')}</label>
                            )}
                            element={
                                <input
                                    type="text"
                                    className="border w-full p-2 rounded-lg dark:bg-gray-700"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    name="email"
                                    placeholder={t('holder-email')}
                                />
                            }
                            error={formik.errors.email}
                        />
                    </ProfileSection>
                    <ProfileSection title={t('edit-international-information')}>
                        <ProfileItem
                            icon="culture"
                            label={formik.errors.culture ? (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('culture')}<span className='text-red-600'>*</span></label>
                            ) : (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('culture')}</label>
                            )}
                            element={
                                <select
                                    className="border w-full p-2 rounded-lg dark:bg-gray-700"
                                    value={formik.values.culture}
                                    onChange={formik.handleChange}
                                    name="culture"
                                >
                                    <option value="" disabled>{t('select-culture')}</option>
                                    {selectCulture.map((item, index) => (
                                        <option key={index} value={item.cultureInfoCode}>{item.country}</option>
                                    ))}
                                </select>
                            }
                            error={formik.errors.culture}
                        />
                        <ProfileItem
                            icon="timezone"
                            label={formik.errors.input_timezone ? (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('timezone')}<span className='text-red-600'>*</span></label>
                            ) : (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('timezone')}</label>
                            )}
                            element={
                                <select
                                    className="border w-full p-2 rounded-lg dark:bg-gray-700"
                                    value={formik.values.input_timezone}
                                    onChange={formik.handleChange}
                                    name="input_timezone"
                                >
                                    <option value="" disabled>{t('select-timezone')}</option>
                                    {selectTimezone.map((item, index) => (
                                        <option key={index} value={item.timezone}>{item.timezone}</option>
                                    ))}
                                </select>
                            }
                            error={formik.errors.input_timezone}
                        />
                        <ProfileItem
                            icon="currency"
                            label={formik.errors.currency ? (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('currencies')}<span className='text-red-600'>*</span></label>
                            ) : (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('currencies')}</label>
                            )}
                            element={
                                <select
                                    className="border w-full p-2 rounded-lg dark:bg-gray-700"
                                    value={formik.values.currency}
                                    onChange={formik.handleChange}
                                    name="currency"
                                >
                                    <option value="" disabled>{t('select-currencies')}</option>
                                    {selectCurrency.map((item, index) => {
                                        const [currencyCode, ...currencyNameParts] = item.currency.split('  -  ');
                                        return (
                                            <option key={index} value={currencyCode.trim()}>
                                                {item.currency}
                                            </option>
                                        );
                                    })}
                                </select>
                            }
                            error={formik.errors.currency}
                        />
                        <ProfileItem
                            icon="position"
                            label={formik.errors.currency_position ? (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('currency_position')}<span className='text-red-600'>*</span></label>
                            ) : (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('currency_position')}</label>
                            )}
                            element={
                                <select
                                    className="border w-full p-2 rounded-lg dark:bg-gray-700"
                                    value={formik.values.currency_position}
                                    onChange={formik.handleChange}
                                    name="currency_position"
                                >
                                    <option value="" disabled>{t('select-position')}</option>
                                    <option value="front">{t('left')} ($n)</option>
                                    <option value="back">{t('right')} (n$)</option>
                                </select>
                            }
                            error={formik.errors.currency_position}
                        />
                        <ProfileItem
                            icon="language"
                            label={formik.errors.language ? (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('language')}<span className='text-red-600'>*</span></label>
                            ) : (
                                <label className="text-gray-700 dark:text-gray-300 font-medium mb-2">{t('language')}</label>
                            )}
                            element={
                                <select
                                    className="border w-full p-2 rounded-lg dark:bg-gray-700"
                                    value={formik.values.language}
                                    onChange={formik.handleChange}
                                    name="language"
                                >
                                    <option value="en">English</option>
                                    <option value="id">Indonesian</option>
                                    <option value="jp">Jepang</option>
                                    <option value="ar">Arab</option>
                                    <option value="jv">Jawa</option>
                                </select>
                            }
                            error={formik.errors.language}
                        />
                    </ProfileSection>
                    <div className=''>

                    </div>
                    <button type="submit" className="bg-blue-500 w-full h-12 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-600">
                        {loading ? <LoadingCircle /> : 
                        <>
                            <p className='text-md'>{t('save')}</p>
                        </>}
                    </button>
                </form>
            </div>
        </div>
    );
};

const ProfileSection = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const ProfileItem = ({ icon, label, element, error }) => (
    <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm w-full">
        {label}
        {element}
        {error ? <div className="text-red-500 text-sm mt-1">{error}</div> : null}
    </div>
);


export default dynamic(() => Promise.resolve(EditProfile), { ssr: false });
