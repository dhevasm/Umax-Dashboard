import React, { Suspense } from 'react'

import Navbar from "@/components/Navbar"
import AccountTable from '@/components/Table/AccountTable'
import TableLoading from '@/components/Loading/TableLoading'

const page = () => {
  return (
    <div className='w-full h-screen bg-white'>
      <Navbar />
      <div className="w-full mt-16 h-fit">
        <div className="w-full h-full md:p-10 p-5 bg-white">
          <Suspense fallback={<TableLoading/>}>
            <AccountTable/>
          </Suspense>
        </div>
      </div>
    </div> 
  )
}

export default page