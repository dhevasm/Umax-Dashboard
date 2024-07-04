import React from 'react'

import Navbar from "@/components/Navbar"
import AccountTable from '@/components/Table/AccountTable'

const page = () => {
  return (
    <>
        <Navbar />
        <div className="w-full mt-16 h-screen pb-10">
            <div className="w-full h-full p-10 bg-white">
                <AccountTable/>
            </div>
        </div>
    </> 
  )
}

export default page