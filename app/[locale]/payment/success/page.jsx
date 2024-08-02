'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconContext } from 'react-icons'
import { FaCheckCircle, FaCross, FaExclamationCircle } from 'react-icons/fa'
import { useSearchParams } from 'next/navigation'
import Swal from 'sweetalert2'

const page = () => {  
    const Router = useRouter()
    const [status,setStatus] = useState("empty")

    const searchParams = useSearchParams()
    
  useEffect(() => {
    if(searchParams.get('transaction_status') == "settlement" && searchParams.get('status_code') == 200){
        setStatus("settlement")
    }else if(searchParams.get('transaction_status') == "pending" && searchParams.get('status_code') == 201) {
        setStatus("pending")
    }else{
        setStatus("unknown")
    }
  })
  
  useEffect(() => {
    if(status == "unknown"){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            confirmButtonText: "Back to page"
          }).then((result) => {
            if (result.isConfirmed) {
                Router.push('/')
            }
          });
    }
  }, [status])

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-center">
    <div className='flex w-full justify-center my-3'>
        {
            status == "settlement" ? (
                <>
                    <FaCheckCircle size={50} className='text-2xl font-bold text-green-500' />
                </>
            ) : 
            status == "pending" ? (
                <>
                     <FaExclamationCircle size={50} className='text-2xl font-bold text-yellow-500' />
                </>
            ) : ""
        }
        </div>
        <h2 className="text-4xl font-semibold text-gray-800 mb-2">Payment {status == "settlement" ? "Success" : status == "pending" ? "Pending" : ""}</h2>
        <p className="text-gray-600 mb-4">
        Unfortunately, we couldn't process your payment. Please try again or contact support.
      </p>
      <button onClick={() => Router.back()} className={`${status == "settlement" ? "bg-green-600 hover:bg-green-700" : status == "pending" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-500" } text-white px-4 py-2 rounded transition duration-300`}>
        Create New Tenant
      </button>
    </div>
  </div>
    </>
  )
}

export default page
