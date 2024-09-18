'use client';

import React, { useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FaUser, FaRegAddressBook, FaRegClock, FaNotesMedical } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { BiNetworkChart } from 'react-icons/bi';
import { useTranslations } from 'next-intl';

const AccountDetail = ({ isOpen, onClose, data }) => {
    
    const t = useTranslations('accounts');
    
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 px-3 sm:px-4 md:p-0 xl:px-5 transition-all duration-300 ease-in-out">
            <div className='fixed top-0 left-0 w-screen h-screen z-40' onClick={onClose}></div>
            <div className="rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-lg sm:max-w-2xl bg-white dark:bg-gray-800 transform transition-transform duration-300 scale-100 max-h-[90vh] overflow-hidden z-50">
                
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 border-b pb-2 sm:pb-4 mb-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                            {t('details-of')} <span className='text-blue-600 font-semibold'>{data.username}</span>
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none">
                            <IoIosClose size={30} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className='overflow-y-auto max-h-[70vh]'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <DetailItem label={t('name')} value={data.username} icon={FaUser} />
                        <DetailItem label={t('client')} value={data.client_name} icon={FaRegAddressBook} />
                        <DetailItem label="Platform" value={data.platform === 1 ? "Meta Ads" : data.platform === 2 ? "Google Ads" : "Tiktok Ads"} icon={BiNetworkChart} />
                        <DetailItem label="Email" value={data.email} icon={MdEmail} />
                        <DetailItem label="Status" value={data.status === 1 ? t('active') : data.status === 2 ? t('deactive') : ""} icon={FaRegClock} />
                        <DetailItem label={t('note')} value={data.notes} icon={FaNotesMedical} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-gray-700 rounded-lg shadow-sm flex items-center">
        <Icon className="text-blue-500 mr-3 sm:mr-4" size={24} />
        <div>
            <span className="block text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300">{label}:</span>
            <span className="text-sm sm:text-base text-gray-800 dark:text-gray-200">{value}</span>
        </div>
    </div>
);

export default AccountDetail;
