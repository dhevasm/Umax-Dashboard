'use client';

import React, { useEffect, useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FaUser, FaRegAddressBook, FaRegClock, FaNotesMedical } from 'react-icons/fa';
import { MdAccountCircle, MdEmail, MdLock } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { useFormik } from 'formik';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreateClient = ({ isOpen, onClose, refresh }) => {
    const t = useTranslations("clients");

    const [Country, setCountry] = useState([]);
    const [City, setCity] = useState([]);

    const getAdresslist = async () => {
        try {
            const response = await axios.get("https://countriesnow.space/api/v0.1/countries");
            setCountry(response.data.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    useEffect(() => {
        getAdresslist();
    }, []);

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

    async function handleCityList(countryname){
        let citylist = []
        Country.map((item) => {
            if(item.country === countryname){
                citylist= item.cities;
            }
        });
        setCity(citylist);
    }

    const formik = useFormik({
        initialValues: {
            name: "",
            country: "",
            city: "",
            contact: "",
            password: "",
            confirm_password: "",
            email: "",
            status: "",
            notes: "",
        },
        validateOnBlur: true,
        validate: (values) => {
            const errors = {};
            if (!values.name) {
                errors.name = t('name-error');
            }
            if (!values.country) {
                errors.country = t('country-error');
            } else if (values.country) {
                handleCityList(values.country);
            }
            if (!values.city) {
                errors.city = t('city-error');
            }
            if (!values.contact) {
                errors.contact = t('contact-error');
            }
            if (!values.password) {
                errors.password = t('password-error');
            }
            if (!values.confirm_password) {
                errors.confirm_password = t('confirm-error');
            } else if (values.confirm_password !== values.password) {
                errors.confirm_password = t('confirm-error2');
            }
            if (!values.email) {
                errors.email = t('email-error');
            }
            if (!values.status) {
                errors.status = t('status-error');
            }
            return errors;
        },
        onSubmit: async (values) => {
            console.log("Form values:", values);
            const route = `client-create`;
            const Data = new URLSearchParams({
                name: values.name,
                address: `${values.city}, ${values.country}`,
                contact: values.contact,
                password: values.password,
                confirm_password: values.confirm_password,
                email: values.email,
                status: values.status,
                notes: values.notes ? values.notes : 'Empty',
            });
            try {
                const response = await axios({
                    method: 'POST',
                    url: `${process.env.NEXT_PUBLIC_API_URL}/${route}`,
                    data: Data,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });

                if (response.status === 200) {
                    refresh();
                    onClose();
                    formik.resetForm();
                    Swal.fire("Success", "Client created successfully", "success");
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 px-3 sm:px-4 md:p-0 xl:px-5">
            <div className="bg-white dark:bg-gray-800 rounded-md sm:rounded-md md:rounded-lg xl:rounded-lg shadow-lg p-4 sm:p-4 md:p-6 xl:p-6 w-full max-w-2xl transform transition-transform duration-300 scale-100 overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 pb-4 mb-4 border-b flex justify-between items-center z-10">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300">
                        {t('new-client')}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none">
                        <IoIosClose size={33} />
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[70vh]">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <DetailItem label={t('name')} value={formik.values.name} error={formik.errors.name} touched={formik.touched.name} id="name" type="text" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={FaUser} t={t} holder={t('holder-name')} Country={null} City={null} />
                            <DetailItem label={t('country')} value={formik.values.country} error={formik.errors.country} touched={formik.touched.country} id="country" type="select" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={FaRegClock} t={t} holder={t('holder-country')} Country={Country} City={null} />
                            <DetailItem label={t('city')} value={formik.values.city} error={formik.errors.city} touched={formik.touched.city} id="city" type="select" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={FaRegClock} t={t} holder={t('holder-city')} Country={null} City={City} />
                            <DetailItem label={t('contact')} value={formik.values.contact} error={formik.errors.contact} touched={formik.touched.contact} id="contact" type="text" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={MdAccountCircle} t={t} holder={t('holder-contact')} Country={null} City={null} />
                            <DetailItem label={t('email')} value={formik.values.email} error={formik.errors.email} touched={formik.touched.email} id="email" type="email" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={MdEmail} t={t} holder={t('holder-email')} Country={null} City={null} />
                            <DetailItem label={t('password')} value={formik.values.password} error={formik.errors.password} touched={formik.touched.password} id="password" type="password" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={MdEmail} t={t} holder={t('holder-password')} Country={null} City={null} />
                            <DetailItem label={t('confirm')} value={formik.values.confirm_password} error={formik.errors.confirm_password} touched={formik.touched.confirm_password} id="confirm_password" type="password" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={MdEmail} t={t} holder={t('holder-confirm')} Country={null} City={null} />
                            <DetailItem label={t('status')} value={formik.values.status} error={formik.errors.status} touched={formik.touched.status} id="status" type="select" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={MdLock} t={t} holder={t('select-status')} Country={null} City={null} />
                        </div>
                        <DetailItem label={t('note')} value={formik.values.notes} id="notes" type="textarea" handleChange={formik.handleChange} handleBlur={formik.handleBlur} icon={MdLock} t={t} holder={t('holder-note')} Country={null} City={null} />
                        <div className="mt-6 flex justify-end">
                            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none">
                                {t('save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


const DetailItem = ({ label, value, icon: Icon, id, type, handleChange, handleBlur, t, holder, Country, City, error, touched }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm flex items-center">
        <Icon className="text-blue-500 mr-3" size={24} />
        <div className='flex flex-col gap-1 w-full'>
            <label htmlFor={id} className="text-gray-700 dark:text-gray-300 font-medium">{label}</label>
            {type === 'select' ? (
                label === t('country') ? (
                    <>
                        <select id={id} value={value} onChange={handleChange} onBlur={handleBlur} className='bg-transparent border-b-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-b-blue-500 dark:border-gray-600 dark:text-gray-300'>
                            <option value="">{holder}</option>
                            {
                                Country.length > 0 && Country.map((item, index) => (
                                    <option key={index} value={item.country}>{item.country}</option>
                                ))
                            }
                        </select>
                        <span className='text-sm text-red-600'>{error && touched ? error : ''}</span>
                    </>
                ) : label === t('city') ? (
                    <>
                        <select id={id} value={value} onChange={handleChange} onBlur={handleBlur} className='bg-transparent border-b-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-b-blue-500 dark:border-gray-600 dark:text-gray-300'>
                            <option disabled value={""} >Please Select City</option>
                            {
                                City.length > 0 && City.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))
                            }
                        </select>
                        <span className='text-sm text-red-600'>{error && touched ? error : ''}</span>
                    </>
                ) : (
                    <>
                        <select id={id} value={value} onChange={handleChange} onBlur={handleBlur} className='bg-transparent border-b-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-b-blue-500 dark:border-gray-600 dark:text-gray-300'>
                            <option value="">{holder}</option>
                            <option value="1">{t('active')}</option>
                            <option value="2">{t('deactive')}</option>
                        </select>
                        <span className='text-sm text-red-600'>{error && touched ? error : ''}</span>
                    </>
                )
            ) : (
                <>
                    <input type={type} id={id} className='bg-transparent border-b-2 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-b-blue-500 dark:border-gray-600 dark:text-gray-300' value={value} onChange={handleChange} onBlur={handleBlur} placeholder={holder}/>
                    <span className='text-sm text-red-600'>{error && touched ? error : ''}</span>
                </>
            )}
        </div>
    </div>
);

export default CreateClient;
