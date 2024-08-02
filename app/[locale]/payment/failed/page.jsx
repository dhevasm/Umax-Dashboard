'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconContext } from 'react-icons'
import { FaCheckCircle, FaCross, FaExclamationCircle } from 'react-icons/fa'
import { useSearchParams } from 'next/navigation'
import Swal from 'sweetalert2'

const FailedPage = () => {  
    const Router = useRouter()
    const [order_id, setOrder_id] = useState("")

    const searchParams = useSearchParams()
    
    useEffect(() => {
        setOrder_id(searchParams.get('order_id'))
    }, [searchParams])

    useEffect(() => {
        console.log(order_id)
    }, [order_id])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-center">
                <div className='flex w-full justify-center my-3'>
                    <FaCheckCircle size={50} className='text-2xl font-bold text-green-500' />
                </div>
                <h2 className="text-4xl font-semibold text-gray-800 mb-2">Payment Success</h2>
                <p className="text-gray-600 mb-4">
                    Unfortunately, we couldn&apos;t process your payment. Please try again or contact support.
                </p>
                <button onClick={() => Router.back()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300">
                    Create New Tenant
                </button>
            </div>
        </div>
    )
}

export default FailedPage
