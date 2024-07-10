'use client'

import React, { Suspense, useEffect } from 'react'

import Navbar from "@/components/Navbar"
import dynamic from "next/dynamic";
const ClientTable = dynamic(() => import('@/components/Table/ClientTable'), { ssr: false });
import TableLoading from '@/components/Loading/TableLoading'
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Page = () => {

  const router = useRouter();
  useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
      Swal.fire('You Must Login First', 'Nice Try!', 'error').then(() => {
          router.push('/');
      });
      }
  }, [router]);


  return (
    <div className='w-full h-screen bg-white'>
      <Navbar />
      <div className="w-full mt-20 h-fit">
        <div className="w-full h-full md:p-10 p-5 bg-white">
          <Suspense fallback={<TableLoading/>}>
            <ClientTable/>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default Page