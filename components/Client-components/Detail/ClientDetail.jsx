'use client';

import React, { useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FaUser, FaRegAddressBook, FaRegClock, FaNotesMedical } from 'react-icons/fa';
import { MdAccountCircle, MdEmail, MdLock } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { useFormik } from 'formik';
import axios from 'axios';

const ClientDetail = ({ isOpen, onClose, data, mode, deleteClient }) => {
    const t = useTranslations("clients");

    const [Country, setCountry] = useState([])
    const [City, setCity] = useState([])

    const getAdresslist = async () => {
        await axios.get("https://countriesnow.space/api/v0.1/countries").then((response) => {
            setCountry(response.data.data)
        })
    }

    async function handleCityList(countryname){
        let citylist = []
        Country.map((item) => {
            if(item.country == countryname){
                citylist= item.cities
            }
        })
        setCity(citylist)
    }

    useEffect(() => {
        getAdresslist()
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const [country, city] = data?.address ? data.address.split(', ') : ["", ""];

    const formik = useFormik({
        initialValues: {
            name: mode === "edit" ? data?.name || "" : "",
            country: mode === "edit" ? country || "" : "",
            city: mode === "edit" ? city || "" : "",
            contact: mode === "edit" ? data?.contact || "" : "",
            email: mode === "edit" ? data?.email || "" : "",
            password: "",
            confirm_password: "",
            status: mode === "edit" ? data?.status || "" : "",
            notes: mode === "edit" ? data?.notes || "" : "",
        },
        validateOnBlur: true,
        validate: (values) => {
            const errors = {};
            if (!values.name) {
                errors.name = 'name-required'
            }
            if (!values.address) {
                errors.address = 'address-required'
            }
            if (!values.contact) {
                errors.contact = 'contact-required'
            }
            if (!values.email) {
                errors.email = 'email-required'
            }
            if (mode === "create" && !values.password) {
                errors.password = 'password-required';
            }
            if (mode === "create" && !values.confirm_password) {
                errors.confirm_password = 'confirm-password-required';
            } else if (mode === "create" && values.password !== values.confirm_password) {
                errors.confirm_password = 'passwords-mismatch';
            }
            if (!values.status) {
                errors.status = 'status-required'
            }
            return errors;
        },
        onSubmit: async (values) => {
            const route = mode === 'edit' ? `client-edit?client_id=${data._id}` : 'client-create';
            try {
                const response = await axios({
                    method: mode === 'edit' ? 'PUT' : 'POST',
                    url: `${process.env.NEXT_PUBLIC_API_URL}/${route}`,
                    data: new URLSearchParams(values).toString(),
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });

                if (response.status === 200) {
                    alert(mode === 'edit' ? 'client-updated-successfully' : 'client-created-successfully');
                    location.reload();
                }
            } catch (error) {
                if (error.response && error.response.status === 422) {
                    console.error('Validation Error:', error.response.data);
                    alert('validation-error');
                } else {
                    console.error('Error submitting form:', error);
                    alert('unexpected-error');
                }
            }
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl transform transition-transform duration-300 scale-100 overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-4 border-gray-300 dark:border-gray-600">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300">
                        {mode === 'edit' 
                            ? `${t('details-of')} ${data?.name}` 
                            : t('create-client')}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none">
                        <IoIosClose size={33} />
                    </button>
                </div>
                <form onSubmit={formik.handleSubmit}>
                        {mode === "create" && (
                            <div className='mb-4'>
                                <DetailItem label={t('name')} value={formik.values.name} id="name" type="text" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={FaUser} t={t} holder={t('holder-name')} />  
                            </div>
                        )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {mode === "edit" && (
                            <DetailItem label={t('name')} value={formik.values.name} id="name" type="text" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={FaUser} t={t} holder={t('holder-name')} />
                        )}
                        <DetailItem label={'Country'} value={formik.values.country} id="country" type="select" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={FaRegClock} t={t} holder={'Select Country'} />
                        <DetailItem label={'City'} value={formik.values.city} id="city" type="select" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={FaRegClock} t={t} holder={'Select City'} />
                        <DetailItem label={t('contact')} value={formik.values.contact} id="contact" type="text" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={MdAccountCircle} t={t} holder={t('holder-contact')} />
                        <DetailItem label={t('email')} value={formik.values.email} id="email" type="email" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={MdEmail} t={t} holder={t('holder-email')} />
                        {mode === "create" && (
                            <>
                                <DetailItem label={t('password')} value={formik.values.password} id="password" type="password" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={MdLock} t={t} holder={t('holder-password')} />
                                <DetailItem label={t('confirm')} value={formik.values.confirm_password} id="confirm_password" type="password" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={MdLock} t={t} holder={t('holder-confirm')} />
                            </>
                        )}
                        <DetailItem label={t('status')} value={formik.values.status} id="status" type="select" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={FaRegClock} t={t} holder={t('select-status')} />
                        {mode == 'create' && (
                            <DetailItem label={t('note')} value={formik.values.notes} id="notes" type="text" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={FaNotesMedical} t={t} holder={t('holder-note')} />
                        )}
                    </div>
                        {mode == 'edit' && (
                            <div className='my-4'>
                                <DetailItem label={t('note')} value={formik.values.notes} id="notes" type="text" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={FaNotesMedical} t={t} holder={t('holder-note')} />
                            </div>
                        )}
                    <div className='w-full flex justify-between mt-4 gap-4'>
                        <button type='submit' className='w-full bg-[#3b50df] hover:bg-blue-600 border border-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md focus:outline-none'>
                            {t('save')}
                        </button>
                        {mode === 'edit' && (
                            <button type='button' onClick={() => deleteClient(data?._id)} className='w-full bg-indigo-700 hover:bg-indigo-600 border border-indigo-800 text-white font-semibold py-2 px-6 rounded-lg shadow-md focus:outline-none'>
                                {t('delete')}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, icon: Icon, id, type, handleChange, handleBlur, t, holder }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm flex items-center">
        <Icon className="text-blue-500 mr-3" size={24} />
        <div className='flex flex-col gap-1 w-full'>
            <label htmlFor={id} className="text-gray-700 dark:text-gray-300 font-medium">{label}</label>
            {type === 'select' ? (
                label == 'Country' ? (
                    <select id={id} value={value} onChange={handleChange} onBlur={handleBlur} className='bg-transparent border-b-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-b-blue-500 dark:border-gray-600 dark:text-gray-300'>
                        <option value="">{holder}</option>
                        <option value="1">{t('active')}</option>
                        <option value="2">{t('deactive')}</option>
                    </select>
                ) : label == 'City' ? (
                    <select id={id} value={value} onChange={handleChange} onBlur={handleBlur} className='bg-transparent border-b-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-b-blue-500 dark:border-gray-600 dark:text-gray-300'>
                        <option value="">{holder}</option>
                        <option value="1">{t('active')}</option>
                        <option value="2">{t('deactive')}</option>
                    </select>
                )  : (
                    <select id={id} value={value} onChange={handleChange} onBlur={handleBlur} className='bg-transparent border-b-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-b-blue-500 dark:border-gray-600 dark:text-gray-300'>
                        <option value="">{holder}</option>
                        <option value="1">{t('active')}</option>
                        <option value="2">{t('deactive')}</option>
                    </select>
                )
            ) : (
                <input type={type} id={id} className='bg-transparent border-b-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-b-blue-500 dark:border-gray-600 dark:text-gray-300' value={value} onChange={handleChange} onBlur={handleBlur} placeholder={holder} />
            )}
        </div>
    </div>
);

export default ClientDetail;
