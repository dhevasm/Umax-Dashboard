'use client'

import { useRef } from "react"

export default function AdminSidebar(){

    const sidebarLink = useRef()

    function handleSidebarLink(){
        sidebarLink.current.classList.toggle('hidden')
    }

    return(
        <>
            <div className="fixed z-10 bg-slate-200 w-[300px] h-screen text-black">
                <ul className="pt-20 ms-5">
                    <li className="mb-4">
                        <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200" onClick={handleSidebarLink}>
                            Data table
                            <svg
                             xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 0 1 1 1v2.586l2.707-2.707a1 1 0 1 1 1.414 1.414L11.414 9l2.707 2.707a1 1 0 1 1-1.414 1.414L10 10.414l-2.707 2.707a1 1 0 1 1-1.414-1.414L8.586 9 5.879 6.293A1 1 0 0 1 7.293 4.88L10 7.586V5a1 1 0 0 1 1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <ul className="pl-4 mt-2 space-y-2" ref={sidebarLink}>
                            <li>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-200">Table Tenants</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-200">Table Users</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-200">Table Campaigns</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    )
}