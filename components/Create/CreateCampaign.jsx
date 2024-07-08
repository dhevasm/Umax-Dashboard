'use client';

import React, { useEffect } from 'react';

const CreateAccount = ({ isOpen, onClose }) => {
    const tenant = typeof window !== 'undefined' ? window.localStorage.getItem('tenant_Id') : '';

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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-lg mx-auto">
                <form className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex flex-col space-y-1">
                        <label htmlFor="name" className="font-semibold">Campaign Name</label>
                        <input type="text" id="name" className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="tenant" className="font-semibold">Tenant</label>
                        <select id="tenant" className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Tenant</option>
                            {/* Add options here */}
                        </select>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="account" className="font-semibold">Account</label>
                        <select id="account" className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Account</option>
                            {/* Add options here */}
                        </select>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="objective" className="font-semibold">Objective</label>
                        <select id="objective" className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Objective</option>
                            {/* Add options here */}
                        </select>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="start_date" className="font-semibold">Start Date</label>
                        <input type="date" id="start_date" className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="end_date" className="font-semibold">End Date</label>
                        <input type="date" id="end_date" className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-2 flex flex-col space-y-1">
                        <label htmlFor="status" className="font-semibold">Status</label>
                        <select id="status" className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value={tenant}>Select Status</option>
                            {/* Add options here */}
                        </select>
                    </div>
                    <div className="col-span-2 flex justify-end">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;