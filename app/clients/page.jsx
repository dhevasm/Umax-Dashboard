import React from 'react'

import Navbar from "@/components/Navbar"
import ClientTable from '@/components/Table/ClientTable'

const page = () => {
  return (
    <>
      <Navbar />
      <div className="w-full mt-16 h-screen pb-10">
          <div className="w-full h-full p-10 bg-white">
              <ClientTable/>
          </div>
      </div>
    </>
  )
}

export default page