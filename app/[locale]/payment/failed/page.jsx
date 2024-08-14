'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconContext } from 'react-icons'
import { FaCheckCircle, FaCross, FaExclamationCircle } from 'react-icons/fa'
import { useSearchParams } from 'next/navigation'
import Swal from 'sweetalert2'
import axios from 'axios'

const FailedPage = () => {  
    const Router = useRouter()
    const [order_id, setOrder_id] = useState("")

    const searchParams = useSearchParams()
    
    useEffect(() => {
        setOrder_id(searchParams.get('order_id'))
    }, [searchParams])

    async function deleteorderid(){
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/delete-transaction?order_id=${order_id}`).then((response) =>{
            if(!response.IsError){
                console.log('Transaction deleted')
            }else{
                console.log('Failed to delete transaction')
            }
        })
    }

    useEffect(() => {
       deleteorderid()
    }, [order_id])

    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-bg-login bg-cover bg-no-repeat bg-left">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-center">
                <div className='flex w-full justify-center my-3'>
                    <FaExclamationCircle size={50} className='text-2xl font-bold text-red-500' />
                </div>
                <h2 className="text-4xl font-semibold text-gray-800 mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-4">
                    Unfortunately, we couldn&apos;t process your payment. Please try again or contact support.
                </p>
                <button onClick={() => Router.push("/")} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300">
                    Back to Page
                </button>
            </div>
        </div>
    )
}

export default FailedPage
