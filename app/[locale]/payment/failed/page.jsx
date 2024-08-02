'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { IconContext } from 'react-icons'
import { FaCross, FaExclamationCircle } from 'react-icons/fa'

const page = () => {
    const Router = useRouter()

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-center">
    <div className='flex w-full justify-center my-3'>
        <FaExclamationCircle size={50} className='text-2xl font-bold text-red-500' />
    </div>
      <h2 className="text-4xl font-semibold text-gray-800 mb-2">Payment Failed</h2>
      <p className="text-gray-600 mb-4">
        Unfortunately, we couldn't process your payment. Please try again or contact support.
      </p>
      <button onClick={() => Router.back()} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300">
        Back To Page
      </button>
    </div>
  </div>
    </>
  )
}

export default page