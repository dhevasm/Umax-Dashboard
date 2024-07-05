import React from 'react'

import Navbar from "@/components/Navbar"
import AccountTable from '@/components/Table/AccountTable'

const page = () => {
  return (
    <div className='w-full h-screen bg-white'>
      <Navbar />
      <div className="w-full mt-16 h-fit">
        <div className="w-full h-full md:p-10 p-5 bg-white">
          <AccountTable />
        </div>
      </div>
    </div> 
  )
}

export default page