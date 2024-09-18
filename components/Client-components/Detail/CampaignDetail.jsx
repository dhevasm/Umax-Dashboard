'use client';

import React, { useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FaUser, FaRegAddressBook, FaBullhorn, FaCalendarAlt, FaRegClock, FaNotesMedical } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import { BiNetworkChart } from 'react-icons/bi';
import { useTranslations } from 'next-intl';

const CampaignDetail = ({ isOpen, onClose, data }) => {
    const t = useTranslations('campaigns');

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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 px-3 sm:px-4 md:p-0 xl:px-5">
            <div className='fixed top-0 left-0 w-screen h-screen z-40' onClick={onClose}></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-transform duration-300 scale-100 z-50">
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b flex justify-between items-center z-10">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                        {t('details-of')} <span className='text-blue-600 font-semibold'>{data.name}</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300">
                        <IoIosClose size={33} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem label={t('name')} value={data.name} icon={FaUser} />
                        <DetailItem label={t('client')} value={data.client_name} icon={FaRegAddressBook} />
                        <DetailItem label="Platform" value={data.platform === 1 ? "Meta Ads" : data.platform === 2 ? "Google Ads" : "Tiktok Ads"} icon={BiNetworkChart} />
                        <DetailItem label={t('account')} value={data.account_name} icon={MdAccountCircle} />
                        <DetailItem label={t('objective')} value={data.objective === 1 ? "Awareness" : data.objective === 2 ? "Conversion" : "Consideration"} icon={FaBullhorn} />
                        <DetailItem label={t('start-date')} value={data.start_date} icon={FaCalendarAlt} />
                        <DetailItem label="Status" value={data.status === 1 ? t('active') : data.status === 2 ? "Draft" : "Completed"} icon={FaRegClock} />
                        <DetailItem label={t('note')} value={data.notes} icon={FaNotesMedical} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="p-4 bg-slate-50 dark:bg-gray-700 rounded-lg shadow-sm flex items-center">
        <Icon className="text-blue-500 mr-3" size={24} />
        <div>
            <span className="block font-medium text-gray-600 dark:text-gray-300">{label}:</span>
            <span className="text-gray-800 dark:text-gray-200">{value}</span>
        </div>
    </div>
);

export default CampaignDetail;
