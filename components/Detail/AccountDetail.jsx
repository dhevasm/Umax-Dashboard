'use client';

import React, { useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FaUser, FaRegAddressBook, FaRegClock, FaNotesMedical } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { BiNetworkChart } from 'react-icons/bi';

const AccountDetail = ({ isOpen, onClose, data }) => {
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <div className="rounded-lg shadow-lg p-6 w-full max-w-2xl bg-white dark:bg-gray-800 transform transition-transform duration-300 scale-100">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Details of {data.username}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none">
                        <IoIosClose size={33} />
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem label="Name" value={data.username} icon={FaUser} />
                    <DetailItem label="Client" value={data.client_name} icon={FaRegAddressBook} />
                    <DetailItem label="Platform" value={data.platform === 1 ? "Meta Ads" : data.platform === 2 ? "Google Ads" : "Tiktok Ads"} icon={BiNetworkChart} />
                    <DetailItem label="Email" value={data.email} icon={MdEmail} />
                    <DetailItem label="Status" value={data.status === 1 ? "Active" : data.status === 2 ? "Deactive" : ""} icon={FaRegClock} />
                    <DetailItem label="Notes" value={data.notes} icon={FaNotesMedical} />
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="p-6 bg-slate-50 dark:bg-gray-700 rounded-lg shadow-sm flex items-center">
        <Icon className="text-blue-500 mr-3" size={24} />
        <div>
            <span className="block font-medium text-gray-600 dark:text-gray-300">{label}:</span>
            <span className="text-gray-800 dark:text-gray-200">{value}</span>
        </div>
    </div>
);

export default AccountDetail;
